const fs = require("fs");
const path = require("path");

module.exports = function withFirebaseStaticFrameworks(config) {
  if (!config.mods) config.mods = {};
  if (!config.mods.ios) config.mods.ios = {};

  const prevMod = config.mods.ios.dangerous;

  config.mods.ios.dangerous = async (props) => {
    if (prevMod) props = await prevMod(props);

    const podfilePath = path.join(
      props.modRequest.platformProjectRoot,
      "Podfile"
    );

    if (fs.existsSync(podfilePath)) {
      let podfile = fs.readFileSync(podfilePath, "utf8");
      const flag = "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES";

      if (!podfile.includes(flag)) {
        const hook = [
          "  installer.pods_project.targets.each do |target|",
          "    target.build_configurations.each do |config|",
          "      config.build_settings['" + flag + "'] = 'YES'",
          "    end",
          "  end",
        ].join("\n");

        podfile = podfile.replace(
          /post_install do \|installer\|/,
          "post_install do |installer|\n" + hook
        );
        fs.writeFileSync(podfilePath, podfile);
      }
    }

    return props;
  };

  return config;
};
