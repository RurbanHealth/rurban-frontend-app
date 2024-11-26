package com.rurban;
import android.content.Intent;
import android.provider.Settings;
import android.app.Activity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

class LocationSettingsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "LocationSettingsModule"
    }

    @ReactMethod
    fun openLocationSettings() {
        val activity: Activity? = currentActivity
        activity?.let {
            val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
            it.startActivity(intent)
        }
    }
}