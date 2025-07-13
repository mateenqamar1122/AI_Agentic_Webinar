import { cn } from '@/lib/utils'
import { useWebinarStore } from '@/store/useWebinarStore'
import { errorToJSON } from 'next/dist/server/render'
import React, { useState } from 'react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Search, X } from 'lucide-react'
import { CtaTypeEnum } from '@prisma/client'
import { Tabs, TabsTrigger, TabsList } from '../../ui/tabs'
import { SelectTrigger } from '@radix-ui/react-select'
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import Stripe from 'stripe'
import { Assistant } from '@vapi-ai/server-sdk/api'

type Props = {
  stripeProducts: Stripe.Product[] | []
  assistants: Assistant[] | []
}

const CTAStep = ({ stripeProducts, assistants}: Props) => {
    const { formData, updateCTAField, addTag, removeTag, getStepValidationErrors } = useWebinarStore() 
    const [tagInput, setTagInput] = useState('')
    const { ctaLabel, tags, aiAgent, priceId, ctaType } = formData.cta

    const errors = getStepValidationErrors('cta')


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        updateCTAField(name as keyof typeof formData.cta, value)
    }


    const handleAddTag = ( e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault()
            addTag(tagInput.trim())
            setTagInput('')
        }
    }

    
    const handleSelectCTAType = (value: string) => {
      updateCTAField('ctaType', value as CtaTypeEnum)
    }
    
    const handleProductChange = (value: string) =>  {
      updateCTAField('priceId', value)
    } 
    const handleSelectAgent = (value: string) => {
      updateCTAField('aiAgent', value)
    }

    return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="ctaLabel"
              className={errors.ctaLabel ? 'text-red-400' : ''}
            >
              CTA Label <span className='text-red-400'>*</span>
            </Label>
            <Input
              id="ctaLabel"
              name="ctaLabel"
              value={ctaLabel || ''}
              onChange={handleChange}
              placeholder="Let's Get Started"
              className={cn(
                '!bg-background/50 border border-input',
                errors.ctaLabel && 'border-red-400 focus-visible:ring-red-400'
              )}
            />
            {errors.ctaLabel && (
              <p className='text-sm text-red-400'>{errors.ctaLabel}</p>
            )}
          </div>
      
          <div className='space-y-2'>
            <Label htmlFor='tags'>Tags</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags and press Enter"
              className='!bg-background/50 border border-input'
            />
      
            {tags && tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-2'>
                {tags.map((tag: string, index: number) => (
                  <div
                    key={index}
                    className='flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded-md'
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className='text-gray-400 hover:text-white'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="space-y-2 w-full">
            <Label>CTA Type </Label>
            <Tabs 
            defaultValue={CtaTypeEnum.BOOK_A_CALL}
            className="w-full"
            >
                <TabsList className="w-full bg-background">
                <TabsTrigger 
                value={CtaTypeEnum.BOOK_A_CALL}
                className='w-1/2 data-[state=active]:!bg-background/50'
                onClick={() => handleSelectCTAType(CtaTypeEnum.BOOK_A_CALL)}
                >
                    Book a Call 
                </TabsTrigger>
                <TabsTrigger
                value={CtaTypeEnum.BUY_NOW}
                className='w-1/2'
                onClick={() => handleSelectCTAType(CtaTypeEnum.BUY_NOW)}
                >
                    Buy Now
                </TabsTrigger>
            </TabsList>
            </Tabs>
        </div>
        {ctaType === CtaTypeEnum.BOOK_A_CALL && (
          <div className='space-y-2'>
            <Label>Attach an Ai Agent</Label>
            <div className='relative'>
            <div className='mb-2'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-500 ' />
              <Input 
              placeholder='search agents'
              className='pl-9 !bg-background/50 border border-input'
              />
            </div>
            </div>
            <Select 
            value={aiAgent}
            onValueChange={handleSelectAgent}
            >
              <SelectTrigger className='w-full !bg-background/50 border border-input'>
              <SelectValue placeholder='Select an Agent'/>
              </SelectTrigger>
              <SelectContent className='bg-background border border-input max-h-48'>
                {assistants?.length > 0 ? (
                  assistants.map((assistant) => (
                    <SelectItem 
                    key={assistant.id}
                    value={assistant.id}
                    className='!bg-background/50 hover:!bg-white/10'
                    >
                      {assistant.name}
                    </SelectItem>
                  ))
                ): (
                  <SelectItem 
                  value="No Agent Available"
                  disabled>
                    No agents Availabled
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            </div>
        )}

        {ctaType === CtaTypeEnum.BUY_NOW && (
        <div className='space-y-2'>
          <Label>Attach an Product</Label>
          <div className='relative'>
            <div className='mb-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-500' />
                <Input
                placeholder='Search agents' 
                className='pl-9 !bg-background/50 border border-input'
                />
              </div>
            </div> 
            <Select  
            value={priceId}
            onValueChange={handleProductChange}
            >
              <SelectTrigger className='w-full !bg-background/50 border border-input'>
              <SelectValue placeholder="Select an product"/>
              </SelectTrigger>
              <SelectContent className='bg-background border border-input max-h-48'>
              {stripeProducts?.length > 0 ? (
              stripeProducts.map((product) =>(
              <SelectItem 
              key={product.id}
              value={product?.default_price?.toString() || ''}
              className='!bg-background/50 hover:!bg-white/10'
              >
              {product.name}

              </SelectItem>

              ))
              ): (
              <SelectItem 
              disabled 
              value=""
              >
                Create product in stripe
              </SelectItem>
              )
            }
              </SelectContent>
            </Select>
          </div>
        </div> 
      )}
      </div>
    
      );
    
      
    } 
export default CTAStep