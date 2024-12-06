import Foundation

struct PortfolioData: Identifiable, Codable {
    let id = UUID()
    let timestamp: Date
    let value: Double

    // By not including `id` in CodingKeys, it won't be decoded from JSON
    enum CodingKeys: String, CodingKey {
        case timestamp
        case value
    }
}

struct WidgetData: Codable {
    var currentValue: Double
    var dailyChange: Double
    var dailyChangePercent: Double
    var history: [PortfolioData]
}
