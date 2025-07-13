"use client"
import { User } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../../ui/button'
import LightningIcon from '@/icons/LightningIcon'
import PurpleIcon from '../PurpleIcon'
import CreateWebinarButton from '../CreateWebinarButton'
import Stripe from 'stripe'
import SubscriptionModal from '../SubscriptionModal'
import { Assistant } from '@vapi-ai/server-sdk/api'
import StripeElements from '../Stripe/element'

type Props = { 
  user: User; 
  stripeProducts: Stripe.Product[] | []
  assistants: Assistant[] | []
}

const Header = ({user, stripeProducts, assistants}: Props) => { 
  const pathname = usePathname()
  const router = useRouter()
  
  return (
    <div className='w-full px-4 pt-10 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-4 bg-background'>
      {pathname.includes("pipeline") ? (
        <Button 
          className='bg-primary/10 border border-border rounded-xl'
          variant={"outline"}
          onClick={() => router.push('/webinar')}
        >
          <ArrowLeft /> Back to webinar
        </Button>
      ) : (
        <div className='px-4 py-2 flex justify-center text-bold items-center rounded-xl bg-background border border-border text-primary capitalize'> 
          {pathname.split('/')[1]}  
        </div> 
      )}
      <div className='flex gap-4 items-center items-between flex-wrap'>
        <PurpleIcon>
          <LightningIcon/>
        </PurpleIcon>

        {user.subscription ? (
          <CreateWebinarButton  
            stripeProducts={stripeProducts}
            assistants={assistants}
          />
        ) : (
          <StripeElements>
            <SubscriptionModal 
              user={user} 
              stripeProducts={stripeProducts}
              assistants={assistants}
            />
          </StripeElements>
        )}
      </div>
    </div>
  )
}

export default Header