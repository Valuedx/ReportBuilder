import { useState } from 'react'
import { Button } from '../ui'
import { Plus, Save, Settings } from 'lucide-react'

export default function ButtonTest() {
  const [clickCount, setClickCount] = useState(0)
  
  const handleClick = (buttonName) => {
    console.log(`Button clicked: ${buttonName}`)
    setClickCount(prev => prev + 1)
    alert(`${buttonName} button clicked! Total clicks: ${clickCount + 1}`)
  }

  return (
    <div className="p-8 space-y-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Button Test Component</h2>
      <p>Click count: {clickCount}</p>
      
      <div className="space-y-2">
        <Button 
          onClick={() => handleClick('Primary')}
          variant="primary"
        >
          Primary Button
        </Button>
        
        <Button 
          onClick={() => handleClick('Secondary')}
          variant="secondary"
          icon={<Plus className="w-4 h-4" />}
        >
          Secondary with Icon
        </Button>
        
        <Button 
          onClick={() => handleClick('Success')}
          variant="success"
          size="lg"
          icon={<Save className="w-4 h-4" />}
        >
          Success Large
        </Button>
        
        <Button 
          onClick={() => handleClick('Ghost')}
          variant="ghost"
          size="sm"
          icon={<Settings className="w-4 h-4" />}
        >
          Ghost Small
        </Button>
        
        <Button 
          onClick={() => handleClick('Disabled')}
          variant="primary"
          disabled={true}
        >
          Disabled Button
        </Button>
      </div>
    </div>
  )
}
