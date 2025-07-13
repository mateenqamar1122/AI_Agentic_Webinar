'use server'

import { WebinarFormState } from "@/store/useWebinarStore"
import { onAuthenticateUser } from "./auth"
import prismaClient from "@/lib/prismaClient"
import { revalidatePath } from "next/cache"
import {  WebinarStatusEnum } from "@prisma/client"


function combineDateTime(
    date: Date,
    timeStr: string,
    timeFormat: 'AM' | 'PM'
): Date {
    const [hoursStr, minutesStr] = timeStr.split(':')
    let hours = Number.parseInt(hoursStr, 10)
    const minutes = Number.parseInt(minutesStr || '0', 10)


    if (timeFormat === 'PM' && hours < 12) {
        hours += 12 
    }else if (timeFormat === 'AM' && hours === 12 ) {
        hours = 0
    }

    const result = new Date(date)
    result.setHours(hours, minutes, 0, 0)
    return result
}





export const createWebinar = async (formData: WebinarFormState) => {
    try {
        const user = await onAuthenticateUser()
        if (!user) return {status: 401, message: 'Unauthorized'}
        
         if (!user || !user.user?.id) {
      return { status: 401, message: 'Unauthorized: No presenter ID' }
    }
        

        if (!formData.basicInfo.webinarName || !formData.basicInfo.date || !formData.basicInfo.time) {
            return {status: 404, message: "Missing required webinar information"}
        }

        const startTime = combineDateTime(
            formData.basicInfo.date,
            formData.basicInfo.time,
            formData.basicInfo.timeFormat || 'AM'
        )

        if (startTime < new Date()) {
            return {status: 400, message: 'Webinar cannot be scheduled in the past'}
        }

        const webinar = await prismaClient.webinar.create({
            data: {
                title: formData.basicInfo.webinarName,
                description: formData.basicInfo.description || "",
                startTime,
                presenterId: user.user?.id,
                tags: formData.cta.tags || [],
                ctaLabel: formData.cta.ctaLabel,
                ctaType: formData.cta.ctaType,
                aiAgentId: formData.cta.aiAgent || null,
                lockChat: formData.additionalInfo.lockChat || false
            }
        })

        revalidatePath('/')
        return {status: 200, message: 'Webinar created successfully', webinarId: webinar.id}
    } catch (error) {
        console.error('Error:', error)
        return {status: 500, message: 'Failed to create webinar'}
    }
}
//TODO: update frontend to pass webinarStatus
export const getWebinarByPresenterId = async (presenterId: string , webinarStatus?:string) => {
    try{
        let statusFilter: WebinarStatusEnum | undefined

        switch (webinarStatus){
            case 'upcoming':
                statusFilter = WebinarStatusEnum.SCHEDULED
                break
            case 'ended':
                statusFilter = WebinarStatusEnum.ENDED
                break
            default: 
            statusFilter = undefined
        }
        const webinars = await prismaClient.webinar.findMany({
            where: { presenterId, webinarStatus: statusFilter } ,
            include: {
                presenter: {
                    select: {
                        name: true,
                        stripeConnectId: true,
                        id: true,
                    },
                },
            },
        })
        return webinars 
    } catch (error) {
        console.error('Error gettin webinars:', error )
        return []
    }
}

export const getWebinarById = async ( webinarId: string) => {
    try {
        const webinar = await prismaClient.webinar.findUnique({
            where: { id: webinarId},
            include: {
                presenter:{
                    select:{
                        id: true,
                        name: true,
                        profileImage: true,
                        stripeConnectId: true,
                    },
                },
            },
        })
        return webinar
    }catch (error) {
        console.error('Error fetching webinar:', error)
        throw new Error('Failed to fetch webinar')
    }
}

export const changeWebinarStatus = async (
    webinarId: string,
    status: WebinarStatusEnum
) => {
    try {
        const webinar = await prismaClient.webinar.update({
            where: {
                id: webinarId,
            },
            data: {
                webinarStatus: status,
            }
        });
        return {
            status: 200,
            success: true,
            message: "Webinar status updated successfully",
            data: webinar,
        };
    }catch (error) {
        console.error("Error updating webinar status", error);
        return {
            status: 500,
            success: false,
            message: "Failed to update webinar status. Please try again",
        };
    }
}