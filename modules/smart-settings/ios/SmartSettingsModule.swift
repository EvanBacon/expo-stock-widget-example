import ExpoModulesCore
import WidgetKit

public class SmartSettingsModule: Module {
    public func definition() -> ModuleDefinition {
        Name("SmartSettings")

        Function("set") { (key: String, value: Int, group: String?) in
            let userDefaults = UserDefaults(suiteName: group)
            userDefaults?.set(value, forKey: key)
        }

        Function("reloadAllTimelines") { () in
            WidgetCenter.shared.reloadAllTimelines()
        }

    }
}
