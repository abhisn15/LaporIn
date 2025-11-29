import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/api_service.dart';
import '../reports/report_detail_screen.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      // Fetch reports untuk notifikasi
      final reportsResponse = await ApiService().getReports(queryParams: {
        'limit': 50,
        'sort': 'created_at',
        'order': 'desc',
      });

      List<Map<String, dynamic>> notifications = [];
      
      if (reportsResponse.data is Map) {
        final data = reportsResponse.data as Map<String, dynamic>;
        final reports = data['data'] as List? ?? data['reports'] as List? ?? [];
        
        for (var report in reports) {
          final reportData = report as Map<String, dynamic>;
          
          // Buat notifikasi berdasarkan status
          if (reportData['status'] == 'pending') {
            notifications.add({
              'id': 'report_${reportData['id']}',
              'type': 'new_report',
              'title': 'Laporan Baru',
              'message': '${reportData['title'] ?? 'Laporan baru'} - ${reportData['location'] ?? 'Lokasi tidak disebutkan'}',
              'reportId': reportData['id'],
              'timestamp': DateTime.parse(reportData['created_at'] ?? DateTime.now().toIso8601String()),
              'isRead': false,
            });
          } else if (reportData['status'] == 'in_progress') {
            notifications.add({
              'id': 'report_${reportData['id']}_progress',
              'type': 'status_update',
              'title': 'Status Diperbarui',
              'message': 'Laporan "${reportData['title'] ?? 'Laporan'}" sedang diproses',
              'reportId': reportData['id'],
              'timestamp': DateTime.parse(reportData['updated_at'] ?? DateTime.now().toIso8601String()),
              'isRead': false,
            });
          } else if (reportData['status'] == 'resolved') {
            notifications.add({
              'id': 'report_${reportData['id']}_resolved',
              'type': 'status_update',
              'title': 'Laporan Selesai',
              'message': 'Laporan "${reportData['title'] ?? 'Laporan'}" telah diselesaikan',
              'reportId': reportData['id'],
              'timestamp': DateTime.parse(reportData['updated_at'] ?? DateTime.now().toIso8601String()),
              'isRead': false,
            });
          }
        }
      }

      // Sort by timestamp (newest first)
      notifications.sort((a, b) => (b['timestamp'] as DateTime).compareTo(a['timestamp'] as DateTime));

      setState(() {
        _notifications = notifications;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  int get _unreadCount {
    return _notifications.where((n) => n['isRead'] == false).length;
  }

  void _markAsRead(String notificationId) {
    setState(() {
      final index = _notifications.indexWhere((n) => n['id'] == notificationId);
      if (index != -1) {
        _notifications[index]['isRead'] = true;
      }
    });
  }

  void _markAllAsRead() {
    setState(() {
      for (var notification in _notifications) {
        notification['isRead'] = true;
      }
    });
  }

  void _navigateToReport(int reportId) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => ReportDetailScreen(reportId: reportId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifikasi'),
        actions: [
          if (_unreadCount > 0)
            TextButton.icon(
              onPressed: _markAllAsRead,
              icon: const Icon(Icons.done_all, size: 18),
              label: const Text('Tandai Semua'),
              style: TextButton.styleFrom(
                foregroundColor: isDark ? Colors.blue[300] : Colors.blue[600],
              ),
            ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadNotifications,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: Colors.red[300],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Error: $_error',
                        style: TextStyle(color: Colors.red[300]),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadNotifications,
                        child: const Text('Coba Lagi'),
                      ),
                    ],
                  ),
                )
              : _notifications.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.notifications_none,
                            size: 64,
                            color: isDark ? Colors.grey[600] : Colors.grey[400],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Tidak ada notifikasi',
                            style: TextStyle(
                              fontSize: 18,
                              color: isDark ? Colors.grey[400] : Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadNotifications,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(8),
                        itemCount: _notifications.length,
                        itemBuilder: (context, index) {
                          final notification = _notifications[index];
                          final isRead = notification['isRead'] as bool;
                          final timestamp = notification['timestamp'] as DateTime;
                          final reportId = notification['reportId'] as int?;

                          return Card(
                            margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            color: isRead
                                ? null
                                : (isDark
                                    ? Colors.blue[900]!.withOpacity(0.3)
                                    : Colors.blue[50]),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: isRead
                                    ? (isDark ? Colors.grey[700] : Colors.grey[300])
                                    : Colors.blue[600],
                                child: Icon(
                                  notification['type'] == 'new_report'
                                      ? Icons.add_circle_outline
                                      : Icons.update,
                                  color: Colors.white,
                                  size: 20,
                                ),
                              ),
                              title: Text(
                                notification['title'] as String,
                                style: TextStyle(
                                  fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                                ),
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: 4),
                                  Text(
                                    notification['message'] as String,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    _formatTimestamp(timestamp),
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDark ? Colors.grey[500] : Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                              trailing: !isRead
                                  ? Container(
                                      width: 8,
                                      height: 8,
                                      decoration: BoxDecoration(
                                        color: Colors.blue[600],
                                        shape: BoxShape.circle,
                                      ),
                                    )
                                  : null,
                              onTap: () {
                                _markAsRead(notification['id'] as String);
                                if (reportId != null) {
                                  _navigateToReport(reportId);
                                }
                              },
                            ),
                          );
                        },
                      ),
                    ),
    );
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 7) {
      return '${timestamp.day}/${timestamp.month}/${timestamp.year}';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} hari yang lalu';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} jam yang lalu';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} menit yang lalu';
    } else {
      return 'Baru saja';
    }
  }
}

