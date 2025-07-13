"use server"

import prismaClient from "@/lib/prismaClient"
import { AttendanceData } from "@/lib/type"
import { AttendedTypeEnum, CallStatusEnum, CtaTypeEnum } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { turborepoTraceAccess } from "next/dist/build/turborepo-access-trace"

export const getWebinarAttendence = async (webinarId: string,
    options: {
        includeUsers?: boolean
        userLimit: number
    } = { includeUsers: true, userLimit: 100 }
) => {
    try {
        const webinar = await prismaClient.webinar.findUnique({
            where: { id: webinarId },
            select: {
                id: true,
                ctaType: true,
                tags: true,
                presenter: true,
                _count: {
                    select: {
                        attendances: true,
                    }
                }
            }
        })
        if (!webinar) {
            return {
                success: false,
                status: 404,
                error: 'Webinar not found'
            }
        }

        const attendanceCounts = await prismaClient.attendance.groupBy({
            by: ['attendedType'],
            where: {
                webinarId,
            },
            _count: {
                attendedType: true,
            },
        })

        const result: Record<AttendedTypeEnum, AttendanceData> = {} as Record<
            AttendedTypeEnum,
            AttendanceData
        >
        for (const type of Object.values(AttendedTypeEnum)) {
            if (
                type === AttendedTypeEnum.ADDED_TO_CART &&
                webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
            )
                continue
            if (
                type === AttendedTypeEnum.BREAKOUT_ROOM &&
                webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL
            )
                continue

            const countItem = attendanceCounts.find((item) => {
                if (
                    webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
                    type === AttendedTypeEnum.BREAKOUT_ROOM &&
                    item.attendedType === AttendedTypeEnum.ADDED_TO_CART
                ) {
                    return true
                }
                return item.attendedType === type
            })
            result[type] = {
                count: countItem ? countItem?._count.attendedType : 0,
                users: [],
            }
        }

        if (options.includeUsers) {
            for (const type of Object.values(AttendedTypeEnum)) {
                if (
                    (type === AttendedTypeEnum.ADDED_TO_CART &&
                        webinar.ctaType === CtaTypeEnum.BOOK_A_CALL) ||
                    (type === AttendedTypeEnum.BREAKOUT_ROOM &&
                        webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL)
                ) {
                    continue

                }
                const queryType =
                    webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
                        type === AttendedTypeEnum.BREAKOUT_ROOM
                        ? AttendedTypeEnum.ADDED_TO_CART
                        : type

                if (result[type].count > 0) {
                    const attendances = await prismaClient.attendance.findMany
                        ({
                            where: {
                                webinarId,
                                attendedType: queryType,
                            },
                            include: {
                                user: true,
                            },
                            take: options.userLimit,

                            orderBy: {
                                joinedAt: 'desc',
                            },
                        })

                    result[type].users = attendances.map((attendance) => ({
                        id: attendance.user.id,
                        name: attendance.user.name,
                        email: attendance.user.email,
                        attendedAT: attendance.joinedAt,
                        stripeConnectId: null,
                        callStatus: attendance.user.callStatus,
                        createdAt: attendance.user.createdAt,
                        updatedAt: attendance.user.updatedAt,

                    }))
                }
            }
        }

        return {
            success: true,
            ctaType: webinar.ctaType,
            webinarTags: webinar.tags || [],
            presenter: webinar.presenter,
            data: result,
        }
    } catch (error) {
        console.error('Failed tp fetch attendance data:', error)
        return {
            success: false,
            error: 'Failed to fetch attendance data'
        }
    }
}

export const registerAttendee = async ({
    webinarId,
    email,
    name,
}: {
    webinarId: string
    email: string
    name: string
}) => {
    try {
        if (!webinarId || !email) {
            return {
                success: false,
                status: 400,
                message: 'Missing required parameters',
            }
        }

        const webinar = await prismaClient.webinar.findUnique({
            where: { id: webinarId },

        })
        if (!webinar) {
            return { success: false, status: 404, message: 'Webinar not found' }
        }
        let attendee = await prismaClient.attendee.findUnique({
            where: { email },
        })
        if (!attendee) {
            attendee = await prismaClient.attendee.create({
                data: { email, name },
            })
        }

        const existingAttendance = await prismaClient.attendance.findFirst({
            where: {
                attendeeId: attendee.id,
                webinarId: webinarId,
            },
            include: {
                user: true,
            }
        })
        if (existingAttendance) {
            return {
                success: false,
                status: 400,
                data: existingAttendance,
                message: 'Already registered for this webinar'
            }
        }
        const attendance = await prismaClient.attendance.create({
            data: {
                attendedType: AttendedTypeEnum.REGISTERED,
                attendeeId: attendee.id,
                webinarId: webinarId,
            },
            include: {
                user: true,
            }
        })
        revalidatePath(`/${webinarId}`)
        return {
            success: true,
            status: 200,
            data: attendance,
            message: 'Successfully registered for the webinar',
        }
    } catch (error) {
        console.error('Registration error:', error)
        return {
            success: false,
            status: 500,
            error: error,
            message: 'Something went wrong',
        }
    }
}
export const changeAttendanceType = async (
    attendeeId: string,
    webinarId: string,
    attendedType: AttendedTypeEnum
) => {
    try {
        const attendance = await prismaClient.attendance.update({
            where: {
                attendeeId_webinarId: {
                    attendeeId,
                    webinarId,
                },
            },
            data: {
                attendedType,
            }
        })

        return {
            success: true,
            status: 200,
            message: 'Attendance type updated successfully ',
            data: attendance,
        }
    } catch (error) {
        console.error('Error updating attendance type:', error)
        return {
            success: false,
            status: 500,
            message: 'Failed to update attendance type',
            error,
        }
    }
}
export const getAttendeeById = async (
    id: string,
    webinarId: string
) => {

    try {
        const attendee = await prismaClient.attendee.findUnique({
            where: {
                id,
            }
        })
        const attendance=await prismaClient.attendance.findFirst({
            where: {
                attendeeId: id, 
                webinarId: webinarId,
            }
        })

        if (!attendee || !attendance) {
            return {
                status: 404,
                succcess: false,
                message: 'Attendee not found',
            }
        }

        return {
            status: 200,
            succcess: true,
            message: 'Get attendee details successfull',
            data: attendee,
        }
    }catch (error) {
        console.log('Error', error)
        return {
            status: 500,
            succcess: false,
            message: 'Something went wrong!'
        }
    }

}


export const changeCallStatus = async (
    attendeeId: string,
    callStatus: CallStatusEnum
) => {
    try {
        const attendee = await prismaClient.attendee.update({
            where: {
                id: attendeeId,
            },
            data: {
                callStatus: callStatus,
            }
        })
        return {
            success: true,
            status: 200,
            message: 'Call status updated successfully',
            data: attendee,
        }
    }catch (error) {
        console.error('Failed to update call status:', error)
        return { 

            success: false,
            status: 500,
            message: 'Failed to update call status',
           error,
        }
    }
}