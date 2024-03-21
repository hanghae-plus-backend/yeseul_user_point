export class RequestQueue {
    private queue:Function[] = [] //함수를 받는 배열
    private processing = false

    async enqueue(task:Function) {
        // 태스크를 queue에 넣어놓고 하나씩 실행
        this.queue.push(task)
        if (!this.processing) {
            this.processing = true
            await this.processNext()
        }
    }

    private async processNext() {
        // 리스트 내 다음 작업을 진행 길이가 0이면 process를 멈춘다 
        if (this.queue.length ===0) {
            this.processing = false
            return
        }
        const task = this.queue.shift()
        await task()
        await this.processNext()
    }
}