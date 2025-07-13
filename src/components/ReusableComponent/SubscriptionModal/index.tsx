'use client'
import { onGetStripeClientSecret } from '@/actions/stripe'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import PlusIcon from '@/icons/PLusIcon'
import { User } from '@prisma/client'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import CreateWebinarButton from '../CreateWebinarButton'
import { Assistant } from '@vapi-ai/server-sdk/api'
import Stripe from 'stripe'

type Props = {
    user: User
    stripeProducts: Stripe.Product[] | []
    assistants: Assistant[] | []
}

const SubscriptionModal = ({ user, stripeProducts, assistants }: Props) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [showWebinarForm, setShowWebinarForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (!stripe || !elements) {
        return toast.error('Stripe not initialized');
      }

      const intent = await onGetStripeClientSecret(user.email, user.id);

      if (!intent?.secret) {
        throw new Error('Failed to initialize payment');
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(intent.secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('Payment successful', paymentIntent);
      router.refresh();
      setIsModalOpen(false);
    } catch (error: any) {
      console.log('SUBSCRIPTION -->', error);
      toast.error('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setShowWebinarForm(true);
    setIsModalOpen(false);
  };

  if (showWebinarForm) {
    return <CreateWebinarButton stripeProducts={stripeProducts} assistants={assistants} />;
  }

  return ( 
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
            <button 
              className='rounded-xl flex gap-2 items-center hover:cursor-pointer px-4 py-2 border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary hover:bg-primary-20'
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon/>
              Create Webinar
            </button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
                <DialogTitle>Spotlight Subscription</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>Subscribe to access unlimited webinars and premium features.</p>
              <CardElement
                options={{
                    style:{
                        base: {
                            fontSize: '16px',
                            color: '#B4B0AE',
                            '::placeholder':{
                                color: '#B4B0AE',
                            }
                        }
                    }
                }}
                className="border-[1px] outline-none rounded-lg p-3 w-full"
              />
            </div>
            <DialogFooter className='gap-4 items-center flex-col sm:flex-row'>
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className='w-full sm:w-auto'
                  disabled={loading}
                >
                  Skip for now
                </Button>
                <div className='flex gap-2 w-full sm:w-auto'>
                  <DialogClose 
                    className='w-full sm:w-auto border border-border rounded-md px-3 py-2'
                    disabled={loading}
                  >
                    Cancel
                  </DialogClose>
                  <Button 
                    type="submit"
                    className='w-full sm:w-auto'
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin'/>
                        Loading...
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog> 
  )
}

export default SubscriptionModal