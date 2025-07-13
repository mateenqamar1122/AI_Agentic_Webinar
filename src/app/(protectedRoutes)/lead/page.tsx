import PageHeader from '@/components/ReusableComponent/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import HomeIcon from '@/icons/HomeIcon'
import LeadIcon from '@/icons/LeadIcon'
import PipelineIcon from '@/icons/PipelineIcon'
import { Webcam } from 'lucide-react'
import React from 'react'
import { leadData } from './__tests__/data'



const page = () => {
  return (
    <div className='w-full flex flex-col gap-8'>
        <PageHeader 
      rightIcon={<Webcam className='w-3 h-3'/>}
      leftIcon={<LeadIcon className='w-12 h-12'/>}
      mainIcon={<PipelineIcon className='w-3 h-3'/>}
      heading='The Home to all customers'
      placeholder='Search customer...'
      />
      <Table>
        <TableHeader>
            <TableRow>
                <TableHead className='text-sm text-muted-foreground'>
                    Name
                </TableHead>
                <TableHead className='text-sm text-muted-foreground'>
                    Email
                </TableHead>
                <TableHead className='text-sm text-muted-foreground'>
                    Phone
                </TableHead>
                <TableHead className='text-right text-sm text-muted-foreground'>
                    Tags
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {leadData?.map((lead, idx) =>(
                <TableRow 
                key={idx}
                className='border-0'
                >
                    <TableCell className="font-medium">{lead?.name}</TableCell>
                    <TableCell>{lead?.email}</TableCell>
                    <TableCell>{lead?.phone}</TableCell>
                    <TableCell className='text-right'>
                        {lead?.tags?.map((tag, idx) => (
                            <Badge 
                            key={idx}
                            variant="outline"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default page