import Foundation

struct PortfolioData: Identifiable, Codable {
    var id = UUID()
    let timestamp: Date
    let value: Double
}

struct WidgetData: Codable {
    var currentValue: Double
    var dailyChange: Double
    var dailyChangePercent: Double
    var history: [PortfolioData]
}
