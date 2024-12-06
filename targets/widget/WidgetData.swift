import Foundation

struct PortfolioData: Identifiable, Hashable {
    let id = UUID()
    let timestamp: Date
    let value: Double
}

struct WidgetData {
    var currentValue: Double
    var dailyChange: Double
    var dailyChangePercent: Double
    var history: [PortfolioData]
}
