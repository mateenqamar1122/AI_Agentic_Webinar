import {
    StreamVideo,
    StreamVideoClient,
    User as StreamUser
} from '@stream-io/video-react-sdk'
import { WebinarWithPresenter } from '@/lib/type'
import { User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import CustomLivestreamPlayer from './CustomLivestreamPlayer'
import { getTokenForHost } from '@/actions/streamIo'

type Props = {
    apiKey: string
    
    callId: string
    webinar: WebinarWithPresenter
    user: User
}
const hostUser: StreamUser = { id: process.env.NEXT_PUBLIC_STREAM_HOST_ID!}

const LiveStreamState = ({
    apiKey,  
    callId, 
    webinar, 
    user
}: Props) => {
    
        // const client = new StreamVideoClient({apiKey, user: hostUser, token})
        const [hostToken, setHostToken] =useState<string | null>(null)
        const [client, setClient] = useState<StreamVideoClient | null>(null);
        
        useEffect(() => {
            const init = async () => {
                try {
                    const token = await getTokenForHost(
                        webinar.presenterId,
                        webinar.presenter.name,
                        webinar.presenter.profileImage
                    )

                    const hostUser: StreamUser = {
                        id: webinar.presenterId,
                        name: webinar.presenter.name,
                        image: webinar.presenter.profileImage
                    }
                    const streamClient = new StreamVideoClient({
                        apiKey,
                        user: hostUser,
                        token,
                    })
                    setHostToken(token)
                    setClient(streamClient)
 

                } catch (error) {
                    console.error('Error initiailizing Stream client:', error)
                }
            }
            init()
        },[apiKey, webinar])

        if (!client || !hostToken) return null
        return (
        
        <StreamVideo
            client={client}
            >
                <CustomLivestreamPlayer 
                callId={callId}
                callType='livestream'
                webinar={webinar}
                username={user.name}
                token={hostToken}
                />
            </StreamVideo>
        )
}

export default LiveStreamState