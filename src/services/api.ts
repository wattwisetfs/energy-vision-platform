
import { 
  AutoPredictResponse, 
  ForecastRangeRequest, 
  ForecastRangeResponse,
  User,
  Organization,
  Schedule,
  Report,
  Prediction,
  Purchase,
  Supplier
} from "../types";

const BASE_URL = "http://localhost:8000";

// API service for FastAPI backend
export const apiService = {
  // Auto predict endpoint
  getAutoPrediction: async (): Promise<AutoPredictResponse> => {
    try {
      // In a real app, this would call the actual API
      // const response = await fetch(`${BASE_URL}/auto-predict`);
      // return response.json();
      
      // For now, return mock data
      return {
        timestamp: new Date().toISOString(),
        predicted_load: 450 + Math.random() * 50,
        feature_impacts: {
          temperature: 0.45,
          time_of_day: 0.30,
          day_of_week: 0.15,
          humidity: 0.10
        }
      };
    } catch (error) {
      console.error("Failed to fetch auto prediction:", error);
      throw error;
    }
  },

  // Forecast range endpoint
  getForecastRange: async (request: ForecastRangeRequest): Promise<ForecastRangeResponse> => {
    try {
      // In a real app, this would call the actual API
      // const response = await fetch(`${BASE_URL}/forecast-range`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(request),
      // });
      // return response.json();
      
      // For now, generate mock data
      const data = [];
      const startDate = new Date(request.start_date);
      const endDate = new Date(request.end_date);
      
      let interval;
      switch(request.frequency) {
        case "5min": interval = 5 * 60 * 1000; break;
        case "hourly": interval = 60 * 60 * 1000; break;
        case "daily": interval = 24 * 60 * 60 * 1000; break;
      }
      
      for (let date = startDate; date <= endDate; date = new Date(date.getTime() + interval)) {
        const hour = date.getHours();
        // Simulate daily pattern with peak during work hours
        let basePrediction = 300;
        if (hour >= 9 && hour <= 18) {
          basePrediction = 500;
        }
        if (hour >= 19 && hour <= 22) {
          basePrediction = 450;
        }
        
        // Add some randomness
        const prediction = basePrediction + (Math.random() - 0.5) * 100;
        
        data.push({
          timestamp: date.toISOString(),
          predicted_load: prediction,
          feature_impacts: {
            temperature: 0.4 + Math.random() * 0.2,
            time_of_day: 0.25 + Math.random() * 0.1,
            day_of_week: 0.1 + Math.random() * 0.1,
            humidity: 0.05 + Math.random() * 0.1,
            cloud_cover: 0.05 + Math.random() * 0.05
          }
        });
      }
      
      return { data };
    } catch (error) {
      console.error("Failed to fetch forecast range:", error);
      throw error;
    }
  }
};

// Mock Firebase service
export const firebaseService = {
  // Auth methods
  signIn: async (email: string, password: string): Promise<User> => {
    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo, determine user role based on email
    let role: "generator" | "purchaser" | "sldc";
    if (email.includes("generator")) {
      role = "generator";
    } else if (email.includes("purchaser")) {
      role = "purchaser";
    } else if (email.includes("sldc")) {
      role = "sldc";
    } else {
      // Default for demo
      role = "purchaser";
    }
    
    return {
      userId: "user-" + Math.random().toString(36).substring(2, 9),
      email,
      role,
      organizationId: "org-" + Math.random().toString(36).substring(2, 9),
      state: "Karnataka",
      createdAt: new Date()
    };
  },
  
  signUp: async (email: string, password: string, role: string, orgName: string, state: string): Promise<User> => {
    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      userId: "user-" + Math.random().toString(36).substring(2, 9),
      email,
      role: role as any,
      organizationId: "org-" + Math.random().toString(36).substring(2, 9),
      state,
      createdAt: new Date()
    };
  },
  
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  // Firestore methods
  getOrganization: async (orgId: string): Promise<Organization> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      orgId,
      name: "Sample Organization",
      type: "purchaser",
      state: "Karnataka"
    };
  },
  
  getSchedules: async (orgId: string): Promise<Schedule[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return Array(5).fill(0).map((_, i) => ({
      scheduleId: `schedule-${i}`,
      orgId,
      state: "Karnataka",
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      data: { hourly: Array(24).fill(0).map((_, h) => ({ hour: h, value: 100 + Math.random() * 50 })) },
      resourceType: ["solar", "wind", "hydro", "coal"][Math.floor(Math.random() * 4)],
      status: ["draft", "sent", "received"][Math.floor(Math.random() * 3)] as any,
      filePath: `/schedules/file-${i}.json`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    }));
  },
  
  getReports: async (orgId: string): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return Array(4).fill(0).map((_, i) => ({
      reportId: `report-${i}`,
      orgId,
      state: "Karnataka",
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      data: { dailyTotal: 2400 + Math.random() * 200, peak: 150 + Math.random() * 20 },
      status: ["draft", "submitted", "verified", "corrected"][Math.floor(Math.random() * 4)] as any,
      filePath: `/reports/file-${i}.json`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      verifications: i > 1 ? [{
        sldcUserId: "sldc-user-1",
        status: Math.random() > 0.5 ? "verified" : "corrected",
        comments: "Please check your peak hour calculations.",
        suggestions: [
          {
            name: "SolarCorp Ltd",
            cost: 4.2,
            carbon: 0.1,
            resourceType: "solar",
            location: { lat: 12.9716 + Math.random() * 0.1, lon: 77.5946 + Math.random() * 0.1 }
          }
        ],
        verifiedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000)
      }] : []
    }));
  },
  
  getPredictions: async (orgId: string): Promise<Prediction[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return Array(7).fill(0).map((_, i) => ({
      predictionId: `prediction-${i}`,
      orgId,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      data: {
        hourlyMW: Array(24).fill(0).map((_, h) => ({ 
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000).toISOString(),
          value: 100 + Math.sin(h / 3) * 50 + Math.random() * 20
        })),
        feature_impacts: {
          temperature: 0.4 + Math.random() * 0.1,
          time_of_day: 0.3 + Math.random() * 0.1,
          day_of_week: 0.2 + Math.random() * 0.1,
          humidity: 0.1 + Math.random() * 0.05
        }
      },
      carbonEstimate: 0.3 + Math.random() * 0.2,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    }));
  },
  
  getPurchases: async (orgId: string): Promise<Purchase[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return Array(6).fill(0).map((_, i) => ({
      purchaseId: `purchase-${i}`,
      orgId,
      supplier: ["SolarCorp", "WindEnergy", "HydroPlant", "ThermalPower"][Math.floor(Math.random() * 4)],
      resourceType: ["solar", "wind", "hydro", "coal"][Math.floor(Math.random() * 4)],
      volumeMW: 50 + Math.random() * 50,
      cost: 3 + Math.random() * 3,
      carbonEstimate: Math.random() * 0.5,
      location: {
        lat: 12.9716 + Math.random() * 0.2,
        lon: 77.5946 + Math.random() * 0.2
      },
      date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)
    }));
  },
  
  getSuppliers: async (): Promise<Supplier[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        name: "SolarCorp Ltd",
        cost: 4.2,
        carbon: 0.1,
        resourceType: "solar",
        location: { lat: 12.9716, lon: 77.5946 }
      },
      {
        name: "WindEnergy Inc",
        cost: 3.8,
        carbon: 0.15,
        resourceType: "wind",
        location: { lat: 13.0827, lon: 77.6728 }
      },
      {
        name: "HydroPlant Co",
        cost: 3.5,
        carbon: 0.2,
        resourceType: "hydro",
        location: { lat: 12.8988, lon: 77.5008 }
      },
      {
        name: "ThermalPower Corp",
        cost: 2.8,
        carbon: 0.75,
        resourceType: "coal",
        location: { lat: 12.9352, lon: 77.7002 }
      },
      {
        name: "GreenSolar Ltd",
        cost: 4.5,
        carbon: 0.08,
        resourceType: "solar",
        location: { lat: 13.1989, lon: 77.7068 }
      },
      {
        name: "WindFarms Co",
        cost: 3.9,
        carbon: 0.12,
        resourceType: "wind",
        location: { lat: 13.0569, lon: 77.5941 }
      }
    ];
  }
};
