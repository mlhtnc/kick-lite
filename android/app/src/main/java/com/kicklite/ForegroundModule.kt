package com.kicklite

import android.content.Intent
import android.os.Build
import android.os.Process
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlin.system.exitProcess

class ForegroundModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ForegroundService"
    }

    @ReactMethod
    fun startService(durationMs: Int) {
        val context = reactApplicationContext
        val intent = Intent(context, ForegroundService::class.java).apply {
            putExtra("durationMs", durationMs)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }

    @ReactMethod
    fun stopService() {
        val context = reactApplicationContext
        val intent = Intent(context, ForegroundService::class.java)
        context.stopService(intent)
    }

    @ReactMethod
    fun killApp() {
        Process.killProcess(Process.myPid())
        exitProcess(0)
    }
}
