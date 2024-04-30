import prismadb from "@/lib/prismadb"
import { BillboardsForm } from "./components/billboard-form"

const BillboardPage=async({params}:{params:{billboardId:string}})=>{
//we are getting redirected here by client.jsx where [billboardId] is "new" so int that case we will not get data from db, only if we are trying to edit the billboard then [billboardId]is id and will get the data from db 
    const billboard=await prismadb.billboard.findUnique({
        where:{
            id:params.billboardId
        }
    })
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardsForm
                initialData={billboard}
                />
            </div>

        </div>
    )
}
export default BillboardPage