'use client'

import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Store } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from 'zod'

interface BillboardsFormProps{
    initialData:Billboard | null
}
const formSchema=z.object({
    label:z.string().min(1),
    imageUrl:z.string().min(1)
})

type BillboardsFormValues=z.infer<typeof formSchema>

export const BillboardsForm:React.FC<BillboardsFormProps>=({initialData})=>{
    
    const[open,setOpen]=useState(false)
    const[loading,setLoading]=useState(false)
    const params=useParams()
    const router=useRouter()
    const origin=useOrigin()
    console.log("initialData ",initialData)
    const title=initialData?"Edit Billbaord":"Create Billboard"
    const Description=initialData?"Edit a Billbaord":"Add a new Billboard"
    const toastMessage=initialData?"Billboard updated":"Billboard created"
    const action=initialData?"save changes":"Create"

    const form=useForm<BillboardsFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            label:'',imageUrl:""
        }
    })


    const onSubmit=async(data:BillboardsFormValues)=>{
        console.log('dtt ',data)
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/billboards`,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMessage)
        } catch (error) {
            toast.success('Something went wrong')
        }
        finally{
            setLoading(false)
        }
    }

    const onDelete=async()=>{
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success("billboard deleted")
        } catch (error) {
            toast.error("Make Sure you removed all categories using this billboard")
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }
    return(
        <>
        <AlertModal
        isOpen={open}
        onClose={()=>setOpen(false)}
        onConfirm={onDelete}
        loading={loading}

        />
        <div className="flex items-center justify-between">
            <Heading
            title={title}
            description={Description}
            />
            {initialData && (
                <Button
                disabled={loading}
                variant={'destructive'}
                size={'icon'}
                onClick={()=>setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
            )}
        </div>
        <Separator/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Background Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                value={field.value?[field.value]:[]}
                                disabled={loading}
                                onChange={(url)=>{field.onChange(url)}}
                                onRemove={()=>{field.onChange('')}}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name="label"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Billboard Label" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                </div>
                <Button 
                className="ml-auto"
                type="submit" 
                disabled={loading}
                >
                   {action}
                </Button>
            </form>
        </Form>
       
        </>
    )
}