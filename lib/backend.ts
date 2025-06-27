import axios from "axios";



export class Backend {
    private static instance: Backend;
    private constructor() {}

    public static getInstance(): Backend {
        if (!Backend.instance) {
            Backend.instance = new Backend();
        }
        return Backend.instance;
    }

    public async analyzeCase(caseId: string): Promise<any> {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze?caseId=${caseId}`);
        return response.data;
    }
    

    public async processCase(caseId: string): Promise<any> {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze/process?caseId=${caseId}`);
        return response.data;
    }
    
}



