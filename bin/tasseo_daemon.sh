#!/bin/bash
# This shell is used manually daemon tasseo foreman service when it is unavailable
#

source /opt/tasseo/.awssetting

export TASSEO_HOME=/opt/tasseo
export TASSEO_LOG=/opt/tasseo/tasseo.log


http_test_entry=http://localhost:5000/
check_interval_in_seconds=60
shell_name=$0
daemon_log_filename=$TASSEO_HOME/daemon.log

stopService()
{
	ps aux | grep -E 'ruby' | grep -E 'rackup' | grep -v grep | awk '{print $2}' | xargs sudo kill -9
}

startService()
{
	pushd $TASSEO_HOME
	nohup foreman start >>$TASSEO_LOG 2>&1 &
	popd
}
restartServiceIfItIsUnavailable()
{
	text=`curl --fail --silent --show-error $http_test_entry --connect-timeout 30 -m 30`
	if [[ $text ==  *Gaia\-SM\-Test* ]]
	then
		echo `date '+%Y-%m-%d %H:%M:%S'` Foreman is healthy.
	else
		echo `date '+%Y-%m-%d %H:%M:%S'` "Foreman is unavailable:" $text
		stopForeman
		startForeman
	fi
}
startDaemon()
{
	while [ "  " != "" ]
	do
		restartServiceIfItIsUnavailable
		sleep $check_interval_in_seconds
	done
}
stopDaemon()
{
	stopService
	PID=`ps -ef --cols=200 | grep "$shell_name" | awk '{print $2 " " $8}' | sed -e '/grep/d' -e 's/^  *//' -e 's/ .*//'`
	if [ ! "$PID" == "" ]
	then
		kill -9 $PID
	fi
}

if [ "$1" = "daemon" ]; then
	startDaemon
elif [ "$1" = "start" ]; then
	nohup $shell_name daemon >>$daemon_log_filename 2>&1 &
elif [ "$1" = "stop" ]; then
	stopDaemon
elif [ "$1" = "startServiceIfNotExist" ]; then
	restartServiceIfItIsUnavailable
else
	echo "$0 need one argument. Argument options are: daemon, start, stop, startServiceIfNotExist"
fi
