import WidgetKit
import SwiftUI

struct LineChart: View {
  let history: [PortfolioData]
  
  var body: some View {
    GeometryReader { geo in
      let points = history.map { $0.value }
      let minVal = points.min() ?? 0
      let maxVal = points.max() ?? 1
      let scale = maxVal - minVal == 0 ? 1 : maxVal - minVal
      
      Path { path in
        guard let first = points.first else { return }
        let xStep = geo.size.width / CGFloat(points.count - 1)
        let yStart = geo.size.height - ((CGFloat(first) - CGFloat(minVal)) / CGFloat(scale) * geo.size.height)
        path.move(to: CGPoint(x: 0, y: yStart))
        
        for (index, value) in points.enumerated() {
          let x = CGFloat(index) * xStep
          let y = geo.size.height - ((CGFloat(value) - CGFloat(minVal)) / CGFloat(scale) * geo.size.height)
          path.addLine(to: CGPoint(x: x, y: y))
        }
      }
      .stroke(Color.green, lineWidth: 2)
    }
  }
}

struct PortfolioWidgetEntryView : View {
  @Environment(\.widgetFamily) var family
  var entry: PortfolioProvider.Entry
  
  var body: some View {
    switch family {
    case .systemSmall:
      smallView
    case .systemMedium:
      mediumView
    case .systemLarge:
      largeView
    @unknown default:
      smallView
    }
  }
  
  private var smallView: some View {
    VStack(alignment: .leading) {
      Text(entry.data.currentValue.formatted(.currency(code: "USD")))
        .font(.system(size: 16, weight: .bold))
      Text("\(entry.data.dailyChangePercent, format: .percent.precision(.fractionLength(2)))")
        .font(.caption)
        .foregroundColor(entry.data.dailyChange >= 0 ? .green : .red)
      LineChart(history: entry.data.history)
    }
    .padding()
    .containerBackground(Color.white, for: .widget)
  }
  
  private var mediumView: some View {
    HStack {
      VStack(alignment: .leading, spacing: 4) {
        Text(entry.data.currentValue.formatted(.currency(code: "USD")))
          .font(.system(size: 20, weight: .bold))
        HStack {
          Text(entry.data.dailyChange.formatted(.currency(code: "USD")))
          Text("(\(entry.data.dailyChangePercent, format: .number.precision(.fractionLength(2)))%)")
        }
        .font(.caption)
        .foregroundColor(entry.data.dailyChange >= 0 ? .green : .red)
        
        Spacer()
      }
      .padding()
      
      LineChart(history: entry.data.history)
        .padding()
    }
    .containerBackground(Color.white, for: .widget)
  }
  
  private var largeView: some View {
    VStack(alignment: .leading) {
      Text("Portfolio")
        .font(.headline)
      Text(entry.data.currentValue.formatted(.currency(code: "USD")))
        .font(.system(size: 24, weight: .bold))
      Text("\(entry.data.dailyChange.formatted(.currency(code: "USD"))) (\(entry.data.dailyChangePercent, format: .number.precision(.fractionLength(2)))%)")
        .font(.subheadline)
        .foregroundColor(entry.data.dailyChange >= 0 ? .green : .red)
      
      LineChart(history: entry.data.history)
        .frame(height: 100)
        .padding(.top)
      
      // Additional details, maybe date range or other metrics
      Text("Last updated: \(entry.date, style: .time)")
        .font(.caption)
        .foregroundColor(.secondary)
    }
    .padding()
    .containerBackground(Color.white, for: .widget)
  }
}



struct PortfolioProvider: TimelineProvider {
  func placeholder(in context: Context) -> PortfolioEntry {
    PortfolioEntry(date: Date(), data: WidgetData(
      currentValue: 21815.99,
      dailyChange: 245.85,
      dailyChangePercent: 1.14,
      history: sampleHistory()
    ))
  }
  
  func getSnapshot(in context: Context, completion: @escaping (PortfolioEntry) -> ()) {
    let entry = PortfolioEntry(date: Date(), data: loadDataFromSharedStore())
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<PortfolioEntry>) -> ()) {
    // Fetch data from shared container
    let data = loadDataFromSharedStore()
    let entry = PortfolioEntry(date: Date(), data: data)
    
    // Refresh after, say, 15 minutes or when data changes
    let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
    let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
    
    completion(timeline)
  }
  
  // Mock function to load data.
  // In production, load from UserDefaults with App Group or a shared file.
  func loadDataFromSharedStore() -> WidgetData {
    // Example data for demonstration.
    return WidgetData(
      currentValue: 21815.99,
      dailyChange: 245.85,
      dailyChangePercent: 1.14,
      history: sampleHistory()
    )
  }
  
  func sampleHistory() -> [PortfolioData] {
    var data: [PortfolioData] = []
    let baseTime = Date().addingTimeInterval(-3600 * 24)
    for i in 0..<20 {
      let value = 20000 + Double(i) * 10 + Double.random(in: -50...50)
      data.append(PortfolioData(timestamp: baseTime.addingTimeInterval(Double(i)*3600), value: value))
    }
    return data
  }
}

struct PortfolioEntry: TimelineEntry {
  let date: Date
  let data: WidgetData
}



@main
struct PortfolioWidget: Widget {
  let kind: String = "PortfolioWidget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: PortfolioProvider()) { entry in
      PortfolioWidgetEntryView(entry: entry)
    }
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .configurationDisplayName("Portfolio")
    .description("View your portfolio value and daily changes.")
  }
}


#if DEBUG
struct PortfolioWidgetEntryView_Previews: PreviewProvider {
  static var sampleData: WidgetData {
    WidgetData(
      currentValue: 21815.99,
      dailyChange: 245.85,
      dailyChangePercent: 1.14,
      history: {
        var data: [PortfolioData] = []
        let baseTime = Date().addingTimeInterval(-3600 * 24)
        for i in 0..<20 {
          let value = 20000 + Double(i) * 10 + Double.random(in: -50...50)
          data.append(PortfolioData(timestamp: baseTime.addingTimeInterval(Double(i)*3600), value: value))
        }
        return data
      }()
    )
  }
  
  static var entry: PortfolioEntry {
    PortfolioEntry(date: Date(), data: sampleData)
  }
  
  static var previews: some View {
    Group {
      // Small Size Preview
      PortfolioWidgetEntryView(entry: entry)
        .previewContext(WidgetPreviewContext(family: .systemSmall))
      
      // Medium Size Preview
      PortfolioWidgetEntryView(entry: entry)
        .previewContext(WidgetPreviewContext(family: .systemMedium))
      
      // Large Size Preview
      PortfolioWidgetEntryView(entry: entry)
        .previewContext(WidgetPreviewContext(family: .systemLarge))
    }
  }
}
#endif
