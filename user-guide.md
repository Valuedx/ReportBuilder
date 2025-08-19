# Enterprise Report Builder - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Creating Your First Report](#creating-your-first-report)
4. [Advanced Report Features](#advanced-report-features)
5. [Scheduling Reports](#scheduling-reports)
6. [Email Distribution](#email-distribution)
7. [Managing Reports](#managing-reports)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Frequently Asked Questions](#frequently-asked-questions)

---

## Getting Started

### System Requirements

**Browser Requirements:**
- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

**Account Access:**
- Valid user account with appropriate permissions
- Internet connection for cloud-based features
- Email access for report distribution

### Logging In

1. **Navigate to the Application**
   - Open your web browser
   - Go to your organization's Report Builder URL
   - You should see the login screen

2. **Enter Your Credentials**
   - Email address: Your organizational email
   - Password: Your assigned password
   - Click "Sign In"

3. **First-Time Setup**
   - If this is your first login, you may be prompted to:
     - Change your password
     - Set up two-factor authentication (if enabled)
     - Review terms of service

### User Roles and Permissions

**Admin Users:**
- Full access to all features
- Can manage data sources
- Can view all reports across the organization
- Can manage user permissions

**Manager Users:**
- Can create and manage reports
- Can schedule reports
- Can view reports within their department
- Can manage email distribution lists

**Standard Users:**
- Can create personal reports
- Can run existing reports
- Limited scheduling capabilities
- Can receive scheduled reports

---

## Dashboard Overview

### Home Dashboard

When you first log in, you'll see the main dashboard which provides:

#### Statistics Cards
- **Total Reports**: Number of reports you have access to
- **Scheduled Reports**: Currently active scheduled reports
- **Email Recipients**: Total recipients across all your reports
- **Reports This Month**: Reports generated in the current month

#### Recent Reports Table
Displays your most recently run reports with:
- Report name and description
- Last execution time
- Current status (Completed, Failed, Running)
- Number of email recipients
- Quick action buttons

#### Quick Actions
Three main action cards for:
- **Create Report**: Start building a new report
- **Manage Schedules**: View and modify report schedules
- **View Analytics**: Access performance metrics

### Navigation Menu

The top navigation bar includes:
- **Dashboard**: Return to home screen
- **Report Builder**: Create new reports
- **My Reports**: Manage existing reports
- **Schedules**: Configure automated report generation
- **Analytics**: View usage and performance data

---

## Creating Your First Report

### Step 1: Choose Data Sources

1. **Click "Create Report"** from the dashboard or navigate to Report Builder

2. **Select Data Source**
   - Choose from available databases (PostgreSQL, MySQL, etc.)
   - Each data source shows connection status and number of available tables
   - Click on a data source to view its tables

3. **Select Tables**
   - Browse available tables in the selected data source
   - Click table names to add them to your report
   - Selected tables appear in the "Selected Tables" section
   - You can remove tables by clicking the "Remove" button

4. **Review Selected Data**
   - Each selected table shows its column count
   - You can see a preview of available columns
   - Ensure you have all necessary data sources before proceeding

**Example:**
```
Selected Data Sources:
✓ Sales Database (PostgreSQL)
  └── sales_transactions (8 columns)
  └── customers (10 columns)
  └── products (8 columns)
```

### Step 2: Configure Report Fields

1. **Available Fields Panel**
   - Left panel shows all columns from your selected tables
   - Fields are organized by table name
   - Each field shows its data type (text, number, date, etc.)

2. **Add Fields to Report**
   - Click the "+" button next to any field to add it
   - Added fields appear in the "Report Fields" panel on the right

3. **Configure Field Settings**
   For each added field, you can customize:
   - **Display Name**: How the field appears in the report
   - **Aggregation**: For numeric fields (Sum, Average, Count, Min, Max)
   - **Format**: Number formatting, date formats, currency symbols

**Field Configuration Examples:**
```
Field: sales_transactions.amount
├── Display Name: "Total Sales"
├── Aggregation: Sum
└── Format: $#,##0.00

Field: sales_transactions.sale_date
├── Display Name: "Sale Date"
├── Aggregation: None
└── Format: MM/DD/YYYY
```

### Step 3: Set Report Criteria (Filters)

1. **Add Filters**
   - Click "Add Filter" to create conditions that limit your data
   - Select the field you want to filter on
   - Choose the condition type (Equals, Greater Than, Contains, etc.)
   - Enter the filter value

2. **Common Filter Types**
   - **Date Ranges**: `sale_date >= 2024-01-01`
   - **Text Matching**: `region contains "North"`
   - **Numeric Conditions**: `amount > 1000`
   - **Status Filters**: `status equals "Active"`

3. **Multiple Filters**
   - Add multiple filters to narrow your data further
   - All filters are combined with "AND" logic
   - Remove filters by clicking the "✕" button

**Filter Examples:**
```
Active Filters:
📅 Sale Date ≥ 2024-01-01
💰 Amount > $500
🌍 Region = "North America"
```

### Step 4: Report Settings & Schedule

1. **Report Information**
   - **Report Name**: Give your report a descriptive name
   - **Description**: Brief explanation of the report's purpose
   - **Format**: Choose PDF, Excel, CSV, or PowerPoint

2. **Layout and Formatting**
   - **Template**: Business Standard, Executive Summary, etc.
   - **Layout**: Table, Chart, Dashboard, or Summary view
   - **Orientation**: Portrait or Landscape
   - **Include Charts**: Add visualizations to your report
   - **Include Summary**: Add executive summary section

3. **Scheduling (Optional)**
   - **Enable Scheduling**: Turn on automated report generation
   - **Frequency**: Daily, Weekly, Monthly, or Quarterly
   - **Time**: When to generate the report
   - **Timezone**: Your local timezone or recipient timezone

**Schedule Examples:**
```
Weekly Report:
├── Frequency: Weekly
├── Day: Monday
├── Time: 9:00 AM
└── Timezone: Eastern Time

Monthly Report:
├── Frequency: Monthly  
├── Day: 1st of month
├── Time: 8:00 AM
└── Timezone: Pacific Time
```

### Step 5: Review and Save

1. **Report Summary**
   - Review all your configurations
   - Check data sources, fields, filters, and settings
   - Verify schedule and email settings

2. **Actions**
   - **Save Report**: Save for future use and scheduling
   - **Generate Report**: Create the report immediately
   - Both actions are available based on your configuration

3. **Execution Results**
   - After generating, you'll see:
     - Execution ID for tracking
     - Download link for the generated file
     - Email delivery status (if configured)

---

## Advanced Report Features

### Data Relationships and Joins

**Understanding Table Relationships:**
- Primary Keys: Unique identifiers in each table
- Foreign Keys: References to other tables
- Common Relationships:
  - Customers ↔ Orders (customer_id)
  - Orders ↔ Products (product_id)
  - Products ↔ Categories (category_id)

**Creating Joins:**
1. Navigate to Step 4: "Join Tables" (only appears with multiple tables)
2. Use suggested relationships or create custom joins
3. Choose join type:
   - **Inner Join**: Only matching records
   - **Left Join**: All records from left table
   - **Right Join**: All records from right table
   - **Full Join**: All records from both tables

### Calculated Fields and Metrics

**Business Calculations:**
- **Profit Margin**: `(revenue - cost) / revenue * 100`
- **Growth Rate**: `(current_period - previous_period) / previous_period * 100`
- **Average Order Value**: `total_revenue / order_count`

**Aggregation Functions:**
- **COUNT**: Number of records
- **SUM**: Total of numeric values
- **AVG**: Average of numeric values
- **MAX**: Highest value
- **MIN**: Lowest value

### Report Templates

**Business Standard Template:**
- Professional layout with company branding
- Includes header with report title and date
- Table format with alternating row colors
- Footer with page numbers and generation timestamp

**Executive Summary Template:**
- High-level overview format
- Key metrics highlighted in callout boxes
- Charts and visualizations prominent
- Minimal detailed data tables

**Financial Report Template:**
- Accounting-standard formatting
- Currency formatting throughout
- Subtotals and grand totals
- Variance columns for comparisons

**Marketing Report Template:**
- Visual-heavy layout
- Multiple chart types
- Campaign performance focus
- Color-coded performance indicators

---

## Scheduling Reports

### Setting Up Automated Reports

1. **Navigate to Report Settings**
   - In the Report Builder, go to Step 4
   - Enable the "Schedule Settings" toggle

2. **Choose Frequency**
   - **Daily**: Every day at specified time
   - **Weekly**: Every week on chosen day
   - **Monthly**: Every month on chosen date
   - **Quarterly**: Every 3 months

3. **Configure Timing**
   - Select specific time (24-hour format)
   - Choose timezone (important for global teams)
   - Set start and end dates if needed

### Managing Schedules

**From the Schedules Page:**
1. View all scheduled reports
2. See next execution times
3. Pause or resume schedules
4. Modify schedule settings
5. View execution history

**Schedule Status Indicators:**
- 🟢 **Active**: Running on schedule
- 🟡 **Paused**: Temporarily disabled
- 🔴 **Failed**: Last execution failed
- 🔵 **Running**: Currently executing

### Best Practices for Scheduling

**Timing Considerations:**
- Schedule reports during off-peak hours
- Consider recipient timezones for delivery
- Avoid scheduling multiple large reports simultaneously
- Allow buffer time between related reports

**Frequency Guidelines:**
- **Daily**: Operational metrics, KPIs
- **Weekly**: Team performance, project status
- **Monthly**: Financial reports, trend analysis
- **Quarterly**: Strategic reviews, board reports

---

## Email Distribution

### Setting Up Email Delivery

1. **Enable Email Distribution**
   - In Report Settings, toggle "Send via Email"
   - This reveals email configuration options

2. **Add Recipients**
   - Enter recipient name and email address
   - Click "Add" to include them in the distribution list
   - Remove recipients using the "✕" button

3. **Configure Email Content**
   - **Subject Line**: Custom subject with variables
   - **Email Body**: Personalized message content
### Email Template Variables

Use these variables in your subject line and email body:

**Date Variables:**
- `{{current_date}}`: Today's date
- `{{month}}`: Current month name
- `{{year}}`: Current year
- `{{week_ending}}`: End date of current week
- `{{quarter}}`: Current quarter (Q1, Q2, etc.)

**Report Variables:**
- `{{report_name}}`: Name of the report
- `{{execution_time}}`: When the report was generated
- `{{record_count}}`: Number of records in the report
- `{{file_size}}`: Size of the generated file

**Example Email Template:**
```
Subject: {{report_name}} - {{month}} {{year}}

Dear Team,

Please find attached the {{report_name}} for {{month}} {{year}}.

This report contains {{record_count}} records and was generated on {{current_date}} at {{execution_time}}.

Key highlights from this period will be discussed in our upcoming team meeting.

Best regards,
Analytics Team
```

### Managing Distribution Lists

**Creating Distribution Groups:**
- Group recipients by department or function
- Sales Team: sales@company.com, sales-manager@company.com
- Executive Team: ceo@company.com, cfo@company.com, coo@company.com
- Operations: ops-manager@company.com, ops-team@company.com

**Email Delivery Status:**
- ✅ **Sent**: Email delivered successfully
- ⏳ **Pending**: Email queued for delivery
- ❌ **Failed**: Delivery failed (check email addresses)
- 🔄 **Retrying**: Attempting redelivery

### Troubleshooting Email Issues

**Common Email Problems:**

1. **Emails Not Delivered**
   - Check recipient email addresses for typos
   - Verify emails aren't going to spam folders
   - Confirm email service is operational

2. **Large Attachment Issues**
   - Email size limits (usually 25MB)
   - Use CSV format for large datasets
   - Consider sharing file links instead of attachments

3. **Formatting Problems**
   - Test email templates before scheduling
   - Check variable syntax (use exact format)
   - Preview emails in different email clients

---

## Managing Reports

### My Reports Page

The My Reports page displays all reports you have access to:

**Report Cards Show:**
- Report name and description
- Schedule information (frequency, next run)
- Current status (Active, Paused, Disabled)
- Number of recipients
- Export format
- Last execution date

**Available Actions:**
- ▶️ **Run Now**: Execute report immediately
- ⚙️ **Edit**: Modify report configuration
- 📊 **View Details**: See execution history and statistics
- ⏸️ **Pause**: Temporarily disable scheduling
- 🗑️ **Delete**: Remove report permanently

### Search and Filter Options

**Search Functionality:**
- Search by report name
- Search by description text
- Search by creator name

**Filter Options:**
- **Status**: Active, Paused, Disabled
- **Format**: PDF, Excel, CSV, PowerPoint
- **Schedule**: Daily, Weekly, Monthly, Quarterly
- **Created**: Date range filters

### Report Performance Monitoring

**Execution Metrics:**
- Average execution time
- Success rate percentage
- File size trends
- Email delivery rates

**Performance Indicators:**
- 🟢 **Excellent**: <30 seconds execution
- 🟡 **Good**: 30 seconds - 2 minutes
- 🟠 **Slow**: 2-5 minutes
- 🔴 **Very Slow**: >5 minutes

### Report History and Auditing

**Execution History Includes:**
- Start and completion times
- Success/failure status
- Generated file information
- Email delivery results
- Error messages (if any)
- User who triggered execution

**Audit Trail:**
- Report creation and modifications
- Schedule changes
- User access logs
- Permission changes
- Data source modifications

---

## Troubleshooting

### Common Issues and Solutions

#### Report Generation Problems

**1. "No Data Found" Error**
- **Cause**: Filters are too restrictive
- **Solution**: 
  - Review and adjust filter criteria
  - Check date ranges for validity
  - Verify data exists in source tables
  - Remove filters temporarily to test

**2. "Connection Failed" Error**
- **Cause**: Database connectivity issues
- **Solution**:
  - Contact your system administrator
  - Check if database maintenance is scheduled
  - Verify data source credentials
  - Test connection from Data Sources page

**3. "Report Generation Timeout"**
- **Cause**: Query is too complex or data volume too large
- **Solution**:
  - Add more specific filters to reduce data volume
  - Break large reports into smaller sections
  - Schedule during off-peak hours
  - Contact admin about query optimization

#### Scheduling Issues

**1. Reports Not Running on Schedule**
- **Check**: Schedule status (Active vs Paused)
- **Check**: Timezone settings
- **Check**: End date hasn't passed
- **Solution**: Re-save schedule configuration

**2. Inconsistent Execution Times**
- **Cause**: High system load
- **Solution**: Spread out schedule times
- **Solution**: Use different time slots for large reports

#### Email Delivery Problems

**1. Recipients Not Receiving Emails**
- **Check**: Email addresses for typos
- **Check**: Spam/junk folders
- **Check**: Corporate email filters
- **Solution**: Add sender to safe senders list

**2. Email Formatting Issues**
- **Check**: Template variable syntax
- **Test**: Send test emails first
- **Solution**: Use plain text for troubleshooting

### Getting Help

**Self-Service Resources:**
1. Check this User Guide first
2. Review system status page
3. Search knowledge base articles
4. Check FAQ section below

**Contacting Support:**
- Email: support@yourcompany.com
- Phone: (555) 123-4567
- Help Desk: Available 9 AM - 6 PM EST
- Emergency Issues: 24/7 on-call support

**When Contacting Support, Include:**
- Your username and organization
- Report name and ID (if applicable)
- Error messages (exact text)
- Screenshots of the issue
- Steps to reproduce the problem
- Browser type and version

---

## Best Practices

### Report Design Best Practices

#### Data Selection
- **Start Small**: Begin with essential fields only
- **Add Gradually**: Include additional fields as needed
- **Performance Focus**: Fewer fields = faster reports
- **Business Value**: Every field should serve a purpose

#### Naming Conventions
- **Descriptive Names**: "Monthly Sales by Region" vs "Report 1"
- **Consistent Format**: Use organization standards
- **Include Timeframe**: "Q1 2024 Financial Summary"
- **Avoid Acronyms**: Unless universally understood

#### Filter Strategies
- **Default Filters**: Include sensible date ranges
- **Performance Filters**: Limit data to recent periods
- **Business Logic**: Exclude test data, inactive records
- **Documentation**: Comment on complex filter logic

### Scheduling Best Practices

#### Timing Optimization
- **Off-Peak Hours**: Schedule during low-usage periods
- **Recipient Consideration**: Deliver before business hours
- **Global Teams**: Consider multiple timezone deliveries
- **Stagger Reports**: Avoid simultaneous large reports

#### Schedule Maintenance
- **Regular Review**: Monthly review of all schedules
- **Update Recipients**: Keep distribution lists current
- **Performance Monitoring**: Watch execution times
- **Cleanup**: Remove unused or obsolete reports

### Email Distribution Best Practices

#### Recipient Management
- **Targeted Distribution**: Right people for right reports
- **Regular Updates**: Remove departing employees
- **Role-Based Lists**: Group by function, not individuals
- **Backup Recipients**: Include alternates for key reports

#### Content Guidelines
- **Clear Subject Lines**: Include report name and period
- **Concise Messages**: Brief, professional communication
- **Action Items**: Specify if response/action required
- **Context**: Explain report purpose and key metrics

### Data Security Best Practices

#### Access Control
- **Least Privilege**: Minimum access necessary
- **Regular Audits**: Review user permissions quarterly
- **Sensitive Data**: Extra protection for confidential reports
- **Compliance**: Follow organizational data policies

#### Report Content
- **Data Classification**: Mark sensitive reports appropriately
- **Anonymization**: Remove personal identifiers when possible
- **Retention Policies**: Delete old reports per policy
- **Audit Trails**: Maintain access logs for compliance

---

## Frequently Asked Questions

### General Usage

**Q: How many reports can I create?**
A: Most users can create up to 50 reports. Contact your administrator for higher limits if needed for business purposes.

**Q: Can I share reports with external users?**
A: No, reports can only be shared with users who have accounts in your organization for security reasons.

**Q: How long are generated reports stored?**
A: Reports are typically stored for 90 days. Download important reports for long-term archival.

**Q: Can I schedule the same report with different filters?**
A: Yes, create separate reports with different filter configurations. Each can have its own schedule.

### Technical Questions

**Q: What's the maximum file size for reports?**
A: PDF reports are limited to 100MB, Excel files to 50MB. Use CSV format for larger datasets.

**Q: Can I export data in other formats?**
A: Currently supported formats are PDF, Excel (.xlsx), CSV, and PowerPoint. Additional formats may be added based on demand.

**Q: How real-time is the data?**
A: Data freshness depends on your data source update frequency. Most databases are updated hourly or daily.

**Q: Can I include charts and graphs?**
A: Yes, enable "Include Charts" in report settings. Charts are automatically generated based on your data and aggregations.

### Scheduling and Email

**Q: What happens if a scheduled report fails?**
A: The system will retry up to 3 times. If still failing, you'll receive an error notification email with details.

**Q: Can I schedule reports to run on holidays?**
A: Reports will run on scheduled days regardless of holidays. Contact your administrator to configure holiday calendars.

**Q: How many email recipients can I add?**
A: Up to 100 recipients per report. For larger distributions, consider using distribution groups managed by your email administrator.

**Q: Can I schedule reports more than once per day?**
A: Currently, minimum frequency is daily. For more frequent updates, consider creating multiple reports or using real-time dashboards.

### Data and Performance

**Q: Why is my report running slowly?**
A: Common causes include:
- Large date ranges (try narrower timeframes)
- Many joined tables (optimize relationships)
- Complex filters (simplify conditions)
- Peak usage times (schedule off-hours)

**Q: Can I access historical versions of reports?**
A: Yes, execution history maintains links to previously generated reports for 90 days.

**Q: What happens if my data source goes offline?**
A: Scheduled reports will fail with notification emails sent. Reports will resume automatically when connectivity is restored.

**Q: Can I preview my report before scheduling?**
A: Yes, use "Generate Report" in the final step to create a one-time version before setting up scheduling.

### Troubleshooting

**Q: I'm not receiving scheduled emails. What should I check?**
A: 
1. Verify your email address in the recipient list
2. Check spam/junk folders
3. Confirm the report is actively scheduled
4. Contact IT if corporate email filters might be blocking

**Q: My report shows no data, but I know data exists. What's wrong?**
A: 
1. Check filter date ranges (most common issue)
2. Verify filter values are correct (case-sensitive)
3. Review table joins if using multiple tables
4. Test with no filters to confirm data source connection

**Q: Can I recover a deleted report?**
A: Deleted reports can be recovered within 30 days by contacting your administrator. After 30 days, reports are permanently removed.

**Q: How do I modify a report that's already scheduled?**
A: From My Reports, click "Edit" on the report card. Modifications take effect immediately and apply to future scheduled executions.

---

## Getting Support

### Self-Help Resources

1. **User Guide**: This comprehensive guide (bookmark this page!)
2. **Video Tutorials**: Available in the Help section
3. **Knowledge Base**: Searchable articles for common issues
4. **System Status**: Check for known issues or maintenance

### Contact Information

**Help Desk:**
- Email: helpdesk@yourcompany.com
- Phone: (555) 123-4567
- Hours: Monday-Friday, 9 AM - 6 PM EST
- Response Time: 4 hours during business hours

**Emergency Support:**
- For system outages or critical issues
- Phone: (555) 123-HELP (4357)
- Available: 24/7/365
- Response Time: 30 minutes

**Training and Onboarding:**
- Group training sessions: Monthly
- One-on-one sessions: By appointment
- Documentation: Available in Help section
- Best practices workshops: Quarterly

### Feedback and Suggestions

We value your input for improving the Enterprise Report Builder:

**Feature Requests:**
- Submit through the Feedback form in the application
- Include business justification and expected usage
- Vote on existing feature requests
- Quarterly review and prioritization

**Bug Reports:**
- Use the "Report Issue" button in the application
- Include steps to reproduce the problem
- Attach screenshots if helpful
- Specify browser and operating system

**User Experience Feedback:**
- Regular surveys sent via email
- Focus groups for major updates
- Usability testing sessions
- Annual user conference

---

## Conclusion

The Enterprise Report Builder is designed to empower users across your organization to create, schedule, and distribute professional reports efficiently. This guide covers the essential features and best practices to help you maximize the value of the platform.

### Quick Start Checklist

For new users, follow this checklist:

- [ ] Complete initial login and setup
- [ ] Explore the dashboard and navigation
- [ ] Create your first simple report
- [ ] Test email delivery functionality
- [ ] Set up a basic schedule
- [ ] Review performance and optimize
- [ ] Share feedback with your team

### Continuous Learning

- Attend monthly training sessions
- Join the user community forum
- Subscribe to feature update notifications
- Participate in best practices sharing sessions

### Success Metrics

Track your success with the platform:
- Time saved on manual reporting
- Increased report distribution reach
- Improved data-driven decision making
- Enhanced team collaboration through shared insights

Remember, effective reporting is an iterative process. Start simple, gather feedback, and continuously improve your reports to better serve your organization's needs.

For additional assistance or advanced training opportunities, don't hesitate to contact our support team. We're here to help you succeed with your reporting initiatives.

---

*Last Updated: January 2024*  
*Version: 2.1*  
*Next Review: April 2024*