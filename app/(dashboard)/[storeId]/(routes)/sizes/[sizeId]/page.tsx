import prismadb from "@/lib/prismadb"
import { SizeForm } from "./components/size-form"

const SizePage=async({params}:{params:{sizeId:string}})=>{
//we are getting redirected here by client.jsx where [billboardId] is "new" so int that case we will not get data from db, only if we are trying to edit the billboard then [billboardId]is id and will get the data from db 
    const size=await prismadb.size.findUnique({
        where:{
            id:params.sizeId
        }
    })
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm
                initialData={size}
                />
            </div>

        </div>
    )
}
export default SizePage