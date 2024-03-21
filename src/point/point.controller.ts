import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, ValidationPipe } from "@nestjs/common";
import { PointHistory, TransactionType, UserPoint } from "./point.model";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";
import { PointBody as PointDto } from "./point.dto";
import { NotFoundError } from "rxjs";
import { PointService } from "./point.service";



@Controller('/point')
export class PointController {

    constructor(private readonly pointService: PointService) {} 

    /**
     * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
     * @ return {"id":1,"point":0,"updateMillis":1710815091942}
     */
    @Get(':id')
    async point(@Param('id') id): Promise<UserPoint> {

        const userId = Number.parseInt(id)
        if (isNaN(userId)) {
            throw new BadRequestException(`Invalid user ID: ${id}`);
        }
        const userPoint = await this.pointService.getPoint(userId)
        if (!userPoint) {
            throw new NotFoundException(`User Id ${userId} not found`)
        }
        return userPoint
    }

    /**
     * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
     */
    @Get(':id/histories')
    async history(@Param('id') id): Promise<PointHistory[]> {
        const userId = Number.parseInt(id)
        const userHistory = await this.historyDb.selectAllByUserId(userId)
        return userHistory
    }

    /**
     * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
     */

    @Patch(':id/charge')
    async charge(@Param('id') id: string, @Body() pointDto: PointDto): Promise<any> {
        const userId = Number.parseInt(id);
        if (isNaN(userId)) {
            throw new BadRequestException(`Invalid user ID: ${id}`);
        }
        if (pointDto.amount < 0) {
            throw new BadRequestException(`Negative number input not allowed`);
        }
        return await this.pointService.chargePoint(userId, pointDto.amount);
    }

    /**
     * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
     */
    @Patch(':id/use')
    async use(
        @Param('id') id,
        @Body(ValidationPipe) pointDto: PointDto,
    ): Promise<UserPoint> {
        const userId = Number.parseInt(id)
        if (!userTaskQueues[userId]) {
            userTaskQueues[userId] = new RequestQueue();
        }
    
        return new Promise((resolve, reject) => {
            userTaskQueues[userId].enqueue(async () => {
                try {
                    const amount = pointDto.amount;
                    if (amount < 0) {
                        throw new BadRequestException(`Negative number input not allowed`);
                    }
    
                    const userPoint = await this.userDb.selectById(userId);
                    if (!userPoint) {
                        throw new NotFoundException(`User ID ${userId} not found`);
                    }
    
                    let sumPoint = userPoint.point - amount;
                    if (sumPoint < 0) {
                        throw new BadRequestException(`Insufficient points`);
                    }
    
                    await this.userDb.insertOrUpdate(userId, sumPoint);
                    await this.historyDb.insert(userId, -amount, TransactionType.USE, Date.now());
    
                    resolve({ id: userId, point: sumPoint, updateMillis: Date.now() });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}