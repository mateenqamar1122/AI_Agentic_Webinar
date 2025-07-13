"use client";

import { User, Webinar, WebinarStatusEnum } from '@prisma/client';
import React, { useEffect } from 'react';
import WebinarUpcomingState from './UpcomingWebinar/WebinarUpcomingState';
import { usePathname, useRouter } from 'next/navigation';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { toast } from 'sonner';
import LiveStreamState from './LiveWebinar/LiveStreamState';
import { StreamCallRecording, WebinarWithPresenter } from '@/lib/type';
import Participant from './Participant/Participant';

type Props = {
  error: string | undefined;
  user: User | null;
  webinar: WebinarWithPresenter;
  apiKey: string;
  recording: StreamCallRecording | null 
};

const RenderWebinar = ({
  webinar,
  user,
  apiKey,
  recording,
  error,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { attendee } = useAttendeeStore();

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push(pathname);
    }
  }, [error]); // ✅ Fix dependency warning

  return (
  <React.Fragment>
    {webinar.webinarStatus === WebinarStatusEnum.LIVE ? (
      <React.Fragment>
      {user?.id === webinar.presenterId ? (
      <LiveStreamState 
      apiKey={apiKey}
      webinar={webinar}
      callId={webinar.id}
      user={user}
      />
      ): 
      attendee ? (
        <Participant 
        apiKey={apiKey}
        webinar={webinar}
        callId={webinar.id}
        />
      ) : (
        <WebinarUpcomingState 
        webinar={webinar}
        currentUser={user || null}
        />
      )}
        
    </React.Fragment> 
  ) : webinar.webinarStatus === WebinarStatusEnum.CANCELLED ? (
    <div className='flex justify-center items-center h-full w-full'>
      <div className='text-center space-y-4'>
        <h3 className='text-2xl font-semibold text-primary'>
          {webinar?.title}
        </h3>
        <p className='text-muted-foreground text-xs'>
          This webinar has benn cancelled.
        </p>
      </div>
    </div>
  ) : webinar.webinarStatus === WebinarStatusEnum.ENDED ? (
    recording?.url ? (
      "This is the video"

    ) : (
      <div className='flex justify-center items-center h-full w-full'>
        <div className='text-center space-y-4'>
          <h3 className='text-4xl font-semibold text-primary'>
            {webinar?.title}
          </h3>
           <p className='text-muted-foreground text-xl'>
      This webinar has ended. No recording is availale.
    </p>
        </div>
      </div>
    )

      
    
  ) : (
    <WebinarUpcomingState
    webinar={webinar}
    currentUser={user || null}
    />
  )
  }
  </React.Fragment>
  )
}

export default RenderWebinar;
