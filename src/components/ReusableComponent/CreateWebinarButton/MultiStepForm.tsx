import { useWebinarStore } from '@/store/useWebinarStore'
import { createWebinar } from '@/actions/webinar'
import React, { useState } from 'react'
import {AnimatePresence, easeInOut, motion} from 'framer-motion'
import { AlertCircle, Check, ChevronRight, Key, Loader2 } from 'lucide-react'
import { Separator } from '../../ui/separator'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Step = {
    id: string
    title: string
    description: string
    component: React.ReactNode 
}

type Props = {
    steps: Step[]
    onComplete: (id: string) => void
}

const MultiStepForm = ({steps, onComplete}: Props) => {
    const {formData, validateStep, isSubmitting, setSubmitting, setModalOpen} = useWebinarStore()
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [completedSteps, setCompletedSteps] = useState<string[]>([])
    const [validationError, setValidationError] = useState<string | null>(null)
    const router = useRouter()

    const currentStep = steps[currentStepIndex]
    const isFirstStep = currentStepIndex === 0 
    const isLastStep = currentStepIndex === steps.length - 1

    const handleBack = () => {
        if (isFirstStep) {
            setModalOpen(false)
        } else {
            setCurrentStepIndex(currentStepIndex - 1)
            setValidationError(null)
        }
    }

    const handleNext = async () => {
        setValidationError(null)
        const isValid = validateStep(currentStep.id as keyof typeof formData)

        if (!isValid) {
            setValidationError('Please fill in all required fields')
            return 
        }

        if (!completedSteps.includes(currentStep.id)) {
            setCompletedSteps([...completedSteps, currentStep.id])
        }

        if (isLastStep) {
            try { 
                setSubmitting(true)
                const result = await createWebinar(formData)
                if (result.status === 200 && result.webinarId) {
                    toast.success("Your webinar has been created successfully")
                    onComplete(result.webinarId)
                    setModalOpen(false)
                } else {
                    toast.error(result.message || 'Failed to create webinar')
                    setValidationError(result.message)
                }
                router.refresh()
            } catch (error) {
                console.error('Error creating webinar:', error)
                toast.error('Failed to create webinar. Please try again')
                setValidationError('Failed to create webinar. Please try again')
            } finally {
                setSubmitting(false)
            }
        } else {
            setCurrentStepIndex(currentStepIndex + 1)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center bg-[#27272A]/20 border border-border rounded-3xl overflow-hidden max-w-6xl mx-auto backdrop-blur-[106px]">
            <div className="flex items-center justify-start w-full">
                <div className="w-full md:w-1/3 p-6">
                    <div className="space-y-6">
                        {steps.map((step, index) => {
                            const isCompleted = completedSteps.includes(step.id)
                            const isCurrent = index === currentStepIndex
                            const isPast = index < currentStepIndex
                            return (
                                <div key={step.id} className="relative">
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <motion.div 
                                                initial={false}
                                                animate={{
                                                    backgroundColor: isCurrent || isCompleted ? 'rgb(147, 51, 234)' : 'rgb(31, 41, 55)',
                                                    scale: [isCurrent && !isCompleted ? 0.8 : 1, 1],
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center justify-center w-8 h-8 rounded-full z-10"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {isCompleted ? (
                                                        <motion.div 
                                                            key="check"
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <Check className="w-5 h-5 text-white"/>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="number"
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="text-white"
                                                        >
                                                            {index + 1}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                            {index < steps.length - 1 && (
                                                <div className="absolute top-8 left-4 w-0.5 h-16 bg-gray-700 overflow-hidden">
                                                    <motion.div 
                                                        initial={{ height: isPast || isCompleted ? '100%' : '0%' }}
                                                        animate={{ height: isPast || isCompleted ? '100%' : '0%' }}
                                                        transition={{ duration: 0.5, ease: easeInOut }}
                                                        className="w-full bg-purple-600"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-1">
                                            <motion.h3 
                                                animate={{
                                                    color: isCurrent || isCompleted ? 'rgb(255, 255, 255)' : 'rgb(156, 163, 175)'
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="font-medium"
                                            >
                                                {step.title}
                                            </motion.h3>
                                            <p className="text-sm text-gray-500">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Separator orientation="vertical" className="h-[500px] mx-4" />
                <div className="w-full md:w-2/3 p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep.id}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {currentStep.component}
                        </motion.div>
                    </AnimatePresence>
                    {validationError && (
                        <div className="flex items-center gap-2 text-red-500 mt-4">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{validationError}</span>
                        </div>
                    )}
                    <div className="flex justify-between mt-8">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={isSubmitting}
                        >
                            {isFirstStep ? 'Cancel' : 'Back'}
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : isLastStep ? (
                                'Create Webinar'
                            ) : (
                                'Next'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MultiStepForm