package com.kicklite

import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

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
    fun moveTaskToBack() {
        reactApplicationContext.currentActivity?.moveTaskToBack(true)
    }

    @ReactMethod
    fun isAlive(promise: Promise) {
        promise.resolve(ForegroundService.isAlive())
    }

    @ReactMethod
    fun getRemainingTime(promise: Promise) {
        val remaining = ForegroundService.getRemainingTime()
        promise.resolve(remaining.toInt())
    }
}
