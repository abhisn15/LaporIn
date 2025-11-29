import 'package:flutter/material.dart';

/// Widget helper untuk membuat dialog yang responsive di smartphone
class ResponsiveDialog extends StatelessWidget {
  final String? title;
  final Widget? content;
  final List<Widget>? actions;
  final EdgeInsets? contentPadding;
  final bool scrollable;
  final IconData? icon;
  final Color? iconColor;

  const ResponsiveDialog({
    super.key,
    this.title,
    this.content,
    this.actions,
    this.contentPadding,
    this.scrollable = true,
    this.icon,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 360;
    final isVerySmallScreen = screenSize.width < 320;

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        constraints: BoxConstraints(
          maxWidth: screenSize.width * 0.9,
          maxHeight: screenSize.height * 0.8,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Title Section
            if (title != null || icon != null)
              Padding(
                padding: EdgeInsets.fromLTRB(
                  isSmallScreen ? 16 : 24,
                  isSmallScreen ? 16 : 20,
                  isSmallScreen ? 16 : 24,
                  isSmallScreen ? 12 : 16,
                ),
                child: Row(
                  children: [
                    if (icon != null) ...[
                      Icon(
                        icon,
                        color: iconColor ?? Theme.of(context).colorScheme.primary,
                        size: isSmallScreen ? 24 : 28,
                      ),
                      SizedBox(width: isSmallScreen ? 8 : 12),
                    ],
                    if (title != null)
                      Expanded(
                        child: Text(
                          title!,
                          style: TextStyle(
                            fontSize: isSmallScreen ? 18 : 20,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                  ],
                ),
              ),

            // Content Section (Scrollable)
            if (content != null)
              Flexible(
                child: scrollable
                    ? SingleChildScrollView(
                        padding: contentPadding ??
                            EdgeInsets.symmetric(
                              horizontal: isSmallScreen ? 16 : 24,
                              vertical: isSmallScreen ? 8 : 12,
                            ),
                        child: content!,
                      )
                    : Padding(
                        padding: contentPadding ??
                            EdgeInsets.symmetric(
                              horizontal: isSmallScreen ? 16 : 24,
                              vertical: isSmallScreen ? 8 : 12,
                            ),
                        child: content!,
                      ),
              ),

            // Actions Section
            if (actions != null && actions!.isNotEmpty)
              Container(
                padding: EdgeInsets.fromLTRB(
                  isSmallScreen ? 8 : 16,
                  isSmallScreen ? 8 : 12,
                  isSmallScreen ? 8 : 16,
                  isSmallScreen ? 12 : 16,
                ),
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      color: Theme.of(context).dividerColor,
                      width: 0.5,
                    ),
                  ),
                ),
                child: isVerySmallScreen || actions!.length > 2
                    ? Column(
                        mainAxisSize: MainAxisSize.min,
                        children: actions!
                            .map((action) => SizedBox(
                                  width: double.infinity,
                                  child: Padding(
                                    padding: const EdgeInsets.only(bottom: 8),
                                    child: action,
                                  ),
                                ))
                            .toList(),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: actions!
                            .map((action) => Padding(
                                  padding: EdgeInsets.only(
                                    left: isSmallScreen ? 4 : 8,
                                  ),
                                  child: action,
                                ))
                            .toList(),
                      ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Helper function untuk menampilkan responsive dialog
Future<T?> showResponsiveDialog<T>({
  required BuildContext context,
  String? title,
  Widget? content,
  List<Widget>? actions,
  bool barrierDismissible = true,
  IconData? icon,
  Color? iconColor,
  EdgeInsets? contentPadding,
  bool scrollable = true,
}) {
  return showDialog<T>(
    context: context,
    barrierDismissible: barrierDismissible,
    builder: (context) => ResponsiveDialog(
      title: title,
      content: content,
      actions: actions,
      icon: icon,
      iconColor: iconColor,
      contentPadding: contentPadding,
      scrollable: scrollable,
    ),
  );
}

