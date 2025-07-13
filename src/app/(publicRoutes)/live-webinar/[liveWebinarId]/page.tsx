import { onAuthenticateUser } from '@/actions/auth'
import { getWebinarById } from '@/actions/webinar'
import React from 'react'
import RenderWebinar from './_components/RenderWebinar'
import { WebinarWithPresenter } from '@/lib/type'
import { WebinarStatusEnum } from '@prisma/client'

type Props = {
 
    params: Promise<{
        liveWebinarId: string
    }>
    searchParams: Promise<{
        error: string
    }>
}

const page = async  ({params, searchParams}: Props) => {
    const {liveWebinarId} = await params
    const {error} = await searchParams
    const webinarData = await getWebinarById(liveWebinarId)
    const recording = {}
    if ( webinarData?.webinarStatus === WebinarStatusEnum.ENDED) {
    //    recording = await getStreamRecording(liveWebinarId)
    }
    if (!webinarData){
        return (
            <div className='w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl'
            >
                Webinar not found
            </div>
        )
    }

    const checkUser = await onAuthenticateUser()

    // Todo: create API keys
    const apikey= process.env.NEXT_PUBLIC_STREAM_API_KEY as string
    // const token= process.env.STREAM_TOKEN as string
    // const callId=process.env.STREAM_CALL_ID as string
  return (
    <div className='w-full min-h-screen mx-auto'>
        <RenderWebinar 
        apiKey={apikey}
        user={checkUser.user || null}
        error={error}
        webinar={webinarData as WebinarWithPresenter}
        recording={null}
        />
    </div>
  )
}
export default page