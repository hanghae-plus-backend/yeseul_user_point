import { Injectable } from "@nestjs/common"
import { UserPointTable } from "../database/userpoint.table"
import { PointHistoryTable } from "../database/pointhistory.table"
import { PointHistory, TransactionType, UserPoint } from "./point.model"

// @Injectable
// export class PointTransaction{
//     private dataSource: DataSource


//     constructor(
//         private readonly userDb:UserPointTable,
//         private readonly historyDb: PointHistoryTable,
//     ){
//         this.dataSource = userDb.getDatasource
//     }

//     async chargePoint(userId:number, amount:number): Promise<void>{
//         const userPoint = await this.userDb.selectById(userId)
//         const updatedPoint = userPoint.point + amount
//         await this.userDb.insertOrUpdate(userId, updatedPoint)

//         const history:PointHistory = {
//             userId: userId,
//             type:TransactionType.CHARGE
//             amount: amount,
//             timeMillis: Date.now()
//         }
//         await this.historyDb.insert(history)
//     }
// }