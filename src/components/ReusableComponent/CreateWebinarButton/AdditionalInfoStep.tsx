'use client '
import { useWebinarStore } from '@/store/useWebinarStore'
import React from 'react'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { cn } from '@/lib/utils'
import { Input } from '../../ui/input'
import { Info } from 'lucide-react'

type Props = {}

const AdditionalInfoStep = ({ }: Props) => {

    const { formData, updateAdditionalInfoField, getStepValidationErrors } = useWebinarStore()
    const { lockChat, couponCode, couponEnabled } = formData.additionalInfo
    const handleToggleLockChat = (checked: boolean) => {
        updateAdditionalInfoField('lockChat', checked)
    }
    const handleToggleCoupon = (checked: boolean) => {
        updateAdditionalInfoField('couponEnabled', checked)
    }
    const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateAdditionalInfoField('couponCode', e.target.value) }


        const errors = getStepValidationErrors('additionalInfo')

        return (
            <div className='space-y-8'>
                <div className='flex items-cnter justify-between'>
                    <div>
                        <Label
                            htmlFor='lock-chat'
                            className='text-base font-medium'
                        >
                            Lock Chat
                        </Label>
                        <p className='text-sm text-gray-400'>
                            Turn it on to make chat visible to your users at all time
                        </p>
                    </div>
                    <Switch
                        id='lock-chat'
                        checked={lockChat || false}
                        onCheckedChange={handleToggleLockChat}
                    />
                </div>
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <Label
                                htmlFor='coupon-enabled'
                                className='text-base font-medium'
                            >
                                Coupon Code
                            </Label>
                            <p className='text-sm text-gray-400'>
                                Turn it on to offer discount code to your Viewers
                            </p>
                        </div>
                        <Switch
                            id='coupon-enabled'
                            checked={couponEnabled || false}
                            onCheckedChange={handleToggleCoupon}
                        />
                    </div>
                    couponEnabled && (
                    <div className='space-y-2'>
                        <Input
                            id="coupon-code"
                            value={couponCode || ''}
                            onChange={handleCouponCodeChange}
                            placeholder='Enter coupon code'
                            className={cn(
                                '!bg-background/50 border border-input/50',
                                errors.couponCode && 'border-red-400 focus-visible:ring-red-400'
                            )}
                        />
                        {errors.couponCode && (
                            <p className='text-sm text-red-400'>{errors.couponCode}</p>
                        )}
                        <div className='flex items-start gap-2 text-sm text-gray-400 mt-2'>
                            <Info className="h-4 w-4 mt-0.5" />
                            <p>
                                This coupon code can be used to promote a Sale. Users can use it  for the buy now CTA
                            </p>
                        </div>
                    </div>
  ) 
                </div>
            </div>

        )
    }

    export default AdditionalInfoStep