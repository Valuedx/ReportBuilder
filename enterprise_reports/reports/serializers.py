from rest_framework import serializers
from .models import Report, ReportSchedule, EmailDistribution, ReportExecution


class ReportSerializer(serializers.ModelSerializer):
    """Report serializer with validation"""
    
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at', 'last_executed', 'execution_count']
    
    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Report name must be at least 3 characters long"
            )
        return value.strip()
    
    def validate_data_sources(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError(
                "At least one data source must be specified"
            )
        return value
    
    def validate_fields(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError(
                "At least one field must be specified"
            )
        return value
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ReportScheduleSerializer(serializers.ModelSerializer):
    """Report schedule serializer"""
    
    class Meta:
        model = ReportSchedule
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, data):
        """Validate schedule configuration"""
        if data.get('is_enabled'):
            if data.get('frequency') == 'weekly' and data.get('day_of_week') is None:
                raise serializers.ValidationError(
                    "Day of week must be specified for weekly schedules"
                )
            if data.get('frequency') == 'monthly' and data.get('day_of_month') is None:
                raise serializers.ValidationError(
                    "Day of month must be specified for monthly schedules"
                )
        return data

    def create(self, validated_data):
        # Compute initial next_execution if not provided
        if not validated_data.get('next_execution'):
            next_dt = self._compute_next_execution(validated_data)
            validated_data['next_execution'] = next_dt
        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        # Recompute next_execution when schedule changes and enabled
        if instance.is_enabled:
            instance.next_execution = self._compute_next_execution({
                'frequency': instance.frequency,
                'day_of_week': instance.day_of_week,
                'day_of_month': instance.day_of_month,
                'time': instance.time,
                'timezone': instance.timezone,
                'start_date': instance.start_date,
            })
            instance.save(update_fields=['next_execution'])
        return instance

    def _compute_next_execution(self, data):
        from datetime import datetime, timedelta, time as dtime
        from django.utils import timezone as djtz
        # Start from today at configured time
        now = djtz.localtime()
        sched_time = data.get('time') or dtime(hour=9, minute=0)
        candidate = now.replace(hour=sched_time.hour, minute=sched_time.minute, second=0, microsecond=0)

        freq = data.get('frequency')
        if freq == 'daily':
            if candidate <= now:
                candidate += timedelta(days=1)
        elif freq == 'weekly':
            target_dow = int(data.get('day_of_week') or 0)
            days_ahead = (target_dow - candidate.weekday()) % 7
            if days_ahead == 0 and candidate <= now:
                days_ahead = 7
            candidate += timedelta(days=days_ahead)
        elif freq == 'monthly':
            day = int(data.get('day_of_month') or 1)
            year = candidate.year
            month = candidate.month
            # Move to next month if today has passed
            if candidate.day > day or (candidate.day == day and candidate <= now):
                if month == 12:
                    month = 1
                    year += 1
                else:
                    month += 1
            # Clamp day to last day of month
            import calendar
            last_day = calendar.monthrange(year, month)[1]
            day = min(day, last_day)
            candidate = candidate.replace(year=year, month=month, day=day)
        elif freq == 'quarterly':
            # naive quarterly: +90 days from today at time
            if candidate <= now:
                candidate += timedelta(days=90)
        else:
            if candidate <= now:
                candidate += timedelta(days=1)
        return djtz.make_aware(candidate) if djtz.is_naive(candidate) else candidate


class EmailDistributionSerializer(serializers.ModelSerializer):
    """Email distribution serializer"""
    
    class Meta:
        model = EmailDistribution
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_recipients(self, value):
        """Validate email recipients"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Recipients must be a list")
        
        for recipient in value:
            if not isinstance(recipient, dict):
                raise serializers.ValidationError("Each recipient must be an object")
            if 'email' not in recipient or 'name' not in recipient:
                raise serializers.ValidationError("Each recipient must have email and name")
        
        return value


class ReportExecutionSerializer(serializers.ModelSerializer):
    """Report execution serializer"""
    
    report_name = serializers.CharField(source='report.name', read_only=True)
    
    class Meta:
        model = ReportExecution
        fields = '__all__'
        read_only_fields = ['started_at', 'created_at', 'report_name']


class ReportListSerializer(serializers.ModelSerializer):
    """Simplified report serializer for list views"""
    
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    schedule_summary = serializers.SerializerMethodField()
    email_recipients_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'report_format', 'template', 'layout',
            'is_active', 'last_executed', 'execution_count', 'created_at',
            'created_by_name', 'schedule_summary', 'email_recipients_count'
        ]
    
    def get_schedule_summary(self, obj):
        """Get schedule summary for display"""
        try:
            schedule = obj.schedule
            if not schedule.is_enabled:
                return "No scheduling"
            
            summary = schedule.frequency.title()
            if schedule.frequency == 'weekly':
                days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                summary += f" on {days[schedule.day_of_week]}s"
            elif schedule.frequency == 'monthly':
                summary += f" on day {schedule.day_of_month}"
            
            summary += f" at {schedule.time} {schedule.timezone}"
            return summary
        except ReportSchedule.DoesNotExist:
            return "No scheduling"
    
    def get_email_recipients_count(self, obj):
        """Get email recipients count"""
        try:
            return len(obj.email_distribution.recipients) if obj.email_distribution.is_enabled else 0
        except EmailDistribution.DoesNotExist:
            return 0
