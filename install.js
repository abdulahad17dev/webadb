document.addEventListener("DOMContentLoaded", async function () {
  const connectButton = document.getElementById("connectButton");
  const apkInput = document.getElementById("apkInput");
  const installButton = document.getElementById("installButton");

  let adbDevice;
  let usbDevice;

  connectButton.addEventListener("click", async function () {
    try {
      // Request USB device access
      const devices = await navigator.usb.getDevices();
      if (devices.length > 0) {
        usbDevice = devices[0];
        console.log("Device connected:", usbDevice.productName);
      } else {
        console.log(devices);
        console.log("No USB device found.");
        return;
      }

      // Connect to the device using ADB
      adbDevice = await connectADB(usbDevice);
      console.log("ADB device connected:", adbDevice.id);
    } catch (error) {
      console.error("Error connecting to device:", error);
    }
  });

  installButton.addEventListener("click", async function () {
    if (!adbDevice) {
      console.log('No ADB device connected. Click "Connect to Device" first.');
      return;
    }

    const apkFile = apkInput.files[0];
    if (!apkFile) {
      console.log("Please select an APK file.");
      return;
    }

    const apkPath = apkFile.path;

    try {
      // Trigger the APK installation
      await installAPK(adbDevice, apkPath);
      console.log("Installation successful.");
    } catch (error) {
      console.error("Installation failed:", error);
    }
  });

  async function connectADB(usbDevice) {
    const adb = new Adb();

    // Connect to the device using ADB
    await adb.connect(usbDevice);

    return adb;
  }

  async function installAPK(adbDevice, apkPath) {
    const command = `install -r "${apkPath}"`;
    const response = await adbDevice.shell(command);
    console.log(response);
  }
});
