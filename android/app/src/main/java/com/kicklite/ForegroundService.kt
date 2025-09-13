package com.kicklite

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.os.Handler
import android.os.Looper
import android.os.Process
import androidx.core.app.NotificationCompat
import kotlin.system.exitProcess

class ForegroundService : Service() {

    companion object {
        private var endTime: Long = -1

        fun setEndTime(durationMs: Int) {
            endTime = System.currentTimeMillis() + durationMs
        }

        fun getRemainingTime(): Long {
            return endTime - System.currentTimeMillis()
        }
    }

    private val CHANNEL_ID = "ForegroundServiceChannel"

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
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Kick Lite")
            .setContentText("Audio is playing in background")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setOngoing(true)
            .build()

        startForeground(1, notification)

        val durationMs = intent?.getIntExtra("durationMs", -1) ?: -1

        if (durationMs != -1) {
            setEndTime(durationMs)
            handler.postDelayed({
                killApp()
            }, durationMs.toLong())
        }

        return START_STICKY
    }

    private fun killApp() {
        stopSelf()

        Process.killProcess(Process.myPid())
        exitProcess(0)
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        stopSelf()
    }

    override fun onDestroy() {
        super.onDestroy()
        wakeLock?.release()
        wifiLock?.release()
        handler.removeCallbacksAndMessages(null)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Foreground Service Channel",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }
}
