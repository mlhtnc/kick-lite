package com.kicklite

import android.content.Intent
import android.content.ComponentName
import android.content.ServiceConnection
import android.content.Context
import android.os.IBinder
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class ForegroundModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var service: ForegroundService? = null
    private var bound = false

    private val serviceCallback = object : ForegroundService.ServiceCallback {
        override fun onMessage(msg: String) {
            if(msg == "exitApp") {
                unbind()
                _stopService()
                _exitApp()
            } else if(msg == "onTaskRemoved") {
                unbind()
                _stopService()
            }
        }
    }

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, binder: IBinder?) {
            val localBinder = binder as ForegroundService.LocalBinder
            service = localBinder.getService()
            service?.setCallback(serviceCallback)
            bound = true
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            bound = false
            service = null
        }
    }


    override fun getName(): String {
        return "ForegroundService"
    }

    private fun bind() {
        val intent = Intent(reactApplicationContext, ForegroundService::class.java)
        reactApplicationContext.bindService(intent, connection, Context.BIND_AUTO_CREATE)
    }

    private fun unbind() {
        if (bound) {
            reactApplicationContext.unbindService(connection)
        }
    }

    private fun _stopService() {
        val context = reactApplicationContext
        val intent = Intent(context, ForegroundService::class.java)
        context.stopService(intent)
    }

    private fun _exitApp() {
        reactApplicationContext.currentActivity?.finishAndRemoveTask()
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

        bind()
    }

    @ReactMethod
    fun stopService() {
        unbind()
        _stopService()
    }

    @ReactMethod
    fun isAlive(promise: Promise) {
        promise.resolve(service?.isAlive() ?: false)
    }

    @ReactMethod
    fun getRemainingTime(promise: Promise) {
        val remaining = service?.getRemainingTime() ?: 0L
        promise.resolve(remaining.toInt())
    }

    @ReactMethod
    fun exitApp() {
        unbind()
        _exitApp()
    }
}
