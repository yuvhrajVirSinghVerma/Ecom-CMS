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
import { Billboard, Color, Size, Store } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from 'zod'

interface ColorFormProps{
    initialData:Color | null
}
const formSchema=z.object({
    name:z.string().min(1),
    value:z.string().min(4).regex(/^#/,{
        message:'String must be a valid hex code'
    })
})

type ColorFormValues=z.infer<typeof formSchema>

export const ColorForm:React.FC<ColorFormProps>=({initialData})=>{
    
    const[open,setOpen]=useState(false)
    const[loading,setLoading]=useState(false)
    const params=useParams()
    const router=useRouter()
    const origin=useOrigin()
    console.log("initialData ",initialData)
    const title=initialData?"Edit color":"Create color"
    const Description=initialData?"Edit a color":"Add a new color"
    const toastMessage=initialData?"color updated":"color created"
    const action=initialData?"save changes":"Create"

    const form=useForm<ColorFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name:'',value:""
        }
    })


    const onSubmit=async(data:ColorFormValues)=>{
        console.log('dtt ',data)
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/colors`,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success("color deleted")
        } catch (error) {
            toast.error("Make Sure you removed all Products using this color")
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
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Color Name" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                      <FormField
                    control={form.control}
                    name="value"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-x-4">
                                <Input disabled={loading} placeholder="Color Value" {...field}/>
                                <div
                                className="border p-4 rounded-full"
                                style={{backgroundColor:field.value}}
                                />
                                </div>
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