import "@babel/polyfill";
import { prisma } from '../generated/prisma-client'

// 每天执行
const deleteMessages = async ()=>{
    await prisma.deleteManyGroupMessages()
    await prisma.deleteManyMessages()
}

deleteMessages()
