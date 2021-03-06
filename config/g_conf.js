/*保存了全局配置信息的对象，支持多用户，第0个默认为当前的用户配置信息(运行时读取到第0个，非长期存储)，从第1个开始是存储的用户长期配置信息表*/

var gc_multiLanguage = null;

var g_conf = [
	{steamID: ""
	,language: "auto_detected" /*语言: 自动检测*/
	,delay: 4 /*设置你的留言时间间隔,单位秒*/
	,strNoOperate: "(不留言)" /*设置你的不留言的标识符: 如果不需要留言,则需在备注中添加这个不留言的标识符*/
	,strRemarkPlaceholder: "{name}" /*设置你的称呼占位符: 同上*/
	
	,autoLogin: 1 /*没有登录时是否自动跳转到登录页面 (点击确定跳转，点击关闭不跳转)*/
	,is_Debug: true /*是否是调试模式(总开关，是否显示调试输出，显示当前运行状态)*/
	,isTrackRunStatus: true /*是否跟踪运行状态(更详细的调试输出，可控型只显示错误警告 到 变量级)*/
	,isAddYunBreakWarn: true /*是否添加运行中断警告*/
	
	,YunStatus: false /*当前运行状态(比如正在留言中之类的就是正在运行)*/
	,isTranslationText: false /*是否进行了翻译*/
	
	,isWarnInfo: false /*是否出现警告信息(如果没有则不需要清空)*/
	,isCommentRunStatus: false /*是否正在留言*/
	,isNationalityRunStatus: false /*是否正在设置国籍*/
	,isNoCommentRunStatus: false /*是否正在设置不留言*/
	,isTimeIntervalRunStatus: false /*是否正在设置留言时间间隔*/
	,isAutoCommentRunStatus: false /*是否正在设置自动留言计划*/
	,isFriendToGroupRunStatus: false /*是否正在设置好友分组*/
	}
];/* g_conf[0].*/

