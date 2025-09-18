package com.kicklite

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.Build
import android.os.IBinder
import android.os.Binder
import android.os.PowerManager
import android.os.Handler
import android.os.Looper
import androidx.core.app.NotificationCompat

class ForegroundService : Service() {

    interface ServiceCallback {
        fun onMessage(msg: String)
    }

    inner class LocalBinder : Binder() {
		fun getService(): ForegroundService = this@ForegroundService
	}


    private val CHANNEL_ID = "BackgroundMedia"

    private var endTime: Long = -1
    private var isRunning: Boolean = false

    private var callback: ServiceCallback? = null
    private val binder = LocalBinder()

    private var wakeLock: PowerManager.WakeLock? = null
    private var wifiLock: WifiManager.WifiLock? = null

    private val handler = Handler(Looper.getMainLooper())


    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()

        val pm = getSystemService(POWER_SERVICE) as PowerManager
        wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "KickLite::WakeLock")
        wakeLock?.acquire()

        val wm = applicationContext.getSystemService(WIFI_SERVICE) as WifiManager
        wifiLock = wm.createWifiLock(WifiManager.WIFI_MODE_FULL_HIGH_PERF, "KickLite::WifiLock")
        wifiLock?.acquire()

        isRunning = true
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notificationIntent = Intent(this, MainActivity::class.java).apply {
            setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Kick Lite")
            .setContentText("Stream is playing in background")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()

        startForeground(1, notification)

        val durationMs = intent?.getIntExtra("durationMs", -1) ?: -1

        if (durationMs != -1) {
            setEndTime(durationMs)
            handler.postDelayed({
                callback?.onMessage("exitApp")
            }, durationMs.toLong())
        }

        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        callback?.onMessage("onTaskRemoved")
    }

    override fun onDestroy() {
        super.onDestroy()
        wakeLock?.release()
        wifiLock?.release()
        handler.removeCallbacksAndMessages(null)

        isRunning = false
    }

    override fun onBind(intent: Intent?): IBinder = binder

    fun setCallback(cb: ServiceCallback) {
        callback = cb
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Background Media Playing",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    fun setEndTime(durationMs: Int) {
        endTime = System.currentTimeMillis() + durationMs
    }

    fun getRemainingTime(): Long {
        return endTime - System.currentTimeMillis()
    }

    fun isAlive(): Boolean {
        return isRunning;
    }
}
