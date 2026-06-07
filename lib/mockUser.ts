export interface MockUser {
  name: string
  email: string
  avatar: string
  currency: string
  travelStyle: "budget" | "balanced" | "luxury"
}

export const mockUser: MockUser = {
  name: "Alex Morgan",
  email: "alex.morgan@flycation.app",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  currency: "USD",
  travelStyle: "balanced",
}
