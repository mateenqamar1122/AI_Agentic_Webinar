import { useWebinarStore } from '@/store/useWebinarStore'
import React from 'react'
import { Label } from '../../ui/label'
import { cn } from '@/lib/utils'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Button } from '../../ui/button'
import { CalendarIcon, Clock, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '../../ui/calendar'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'

type Props = {}

const BasicInfoStep = (props: Props) => {
  const { formData , updateBasicInfoField, getStepValidationErrors} = useWebinarStore()
  const {webinarName, description, date, time, timeFormat} = formData.basicInfo
  const errors = getStepValidationErrors('basicInfo')


const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const {name, value} = e.target
  updateBasicInfoField(name as keyof typeof formData.basicInfo,  value)
}


const handleDateChange = (newDate: Date | undefined ) => {
  updateBasicInfoField('date', newDate)
  if (newDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0) //Reset time to start of the day
    if (newDate < today) {
      toast.error('Webinar date cannot be in  the past')
      console.log('Error: Cannot select a date in the past')
    }
  }
}


const handleTimeFormatChange  = (value: string) => {
  updateBasicInfoField('timeFormat', value as 'AM' | 'PM')
}



  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label 
        htmlFor='webinarName'
        className={errors.webinarName ? 'text-red-400' : ''}
        >
          Webinar name <span className='text-red-400'>*</span>
        </Label>
        <Input
        id="webinarName"
        name="webinarName"
        value={webinarName || ''}
        onChange={handleChange}
        placeholder="Introduction to Mochi"
        className={cn(
          '!bg-background/50 border border-input',
          errors.webinarName && 'border-red-400 focus-visible:ring-red-400'
        )}
        />
        {errors.webinarName && (
          <p className='text-sm text-red-400'>
            {errors.webinarName} </p>
        )}
      </div>
      <div className='space-y-2'>
        <Label
        htmlFor='description'
        className={errors.description? 'text-red-400' : ''}
        >
          Description <span className='text-red-400'>*</span>
        </Label>
        <Textarea
        id="description"
        name="description"
        value={description || ''}
        onChange={handleChange}
        placeholder="Tell customers what your webinar is about"
        className={cn(
          ' min-h-[100px]  !bg-background/50 border border-input',
          errors.description && 'border-red-400 focus-visible:ring-red-400'
        )}
      />
        {errors.description && (
          <p className='text-sm text-red-400'>
            {errors.description} </p>
        )}
        {errors.description && (
          <p className='text-sm text-red-400'>
            {errors.description} </p>
        )}
      </div>
      <div className=' grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label
          className={errors.date? 'text-red-400' : ''}
          >
            Date <span className='text-red-400'>*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal !bg-background/50 border border-input',
                !date && 'text-gray-500',
                errors.date && 'border-red-400 focus-visible:ring-red-400'
              )}
              >
              <CalendarIcon className='w-4 h-4 mr-2'/>
              {date? format(date, 'ppp'): 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 !bg-background/50 border border-input">
            <Calendar 
            mode='single'
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            className='bg-background'
            disabled={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0) //Reset time to start of the dayr
              return date < today
            }}
            />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className='text-sm text-red-400'>
              {errors.date} </p>
          )}
          
    </div>
    <div className='space-y-2'>
      <Label className={errors.time ? 'text-red-400' : ''}>
        Webinar Time <span className='text-red-400'>*</span>
      </Label>
     <div className='flex gap-2'>
      <div className='relative flex-1'>
        <Clock className='absolute left-3 top-2.5 h-4 w-4 text-foreground'/>
        <Input 
        name='time'
        value={time || ''}
        onChange={handleChange}
        placeholder="12:00"
        className={cn(
          'pl-9 !bg-background/50 border border-input',
          errors.time && 'border-red-400 focus-visible:ring-red-400'
        )}
        />
        </div>
        <Select 
        value={timeFormat || 'AM'}
        onValueChange={handleTimeFormatChange}
        >
          <SelectTrigger className='w-20!bg-background/50 border border-input'>
            <SelectValue placeholder="AM"/>
          </SelectTrigger>
          <SelectContent className='!bg-background border border-input'>
            <SelectItem value='AM'>
              AM
            </SelectItem>
            <SelectItem value='PM'>
              PM
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {errors.time && 
        <p className='text-sm text-red-400'>
          {errors.time} </p>
      }
     </div>
    </div>

    <div className='flex items-center gap-2 text-sm text-gray-400 mt-4'>
      <div className='flex items-center'>
        <Upload className='w-4 h-4 mr-2'/>
        Uploading a video makes this webinar pre-recorded
      </div>
      <Button 
      variant="outline"
      className='ml-auto relative border border-input hover:bg-background'
      >
        Upload File 
        <Input 
        className="absolute inset-0 opacity-0 cursor-pointer"
        type='file'
        />
      </Button>
    </div>

    </div>
    
  )
}

export default BasicInfoStep;