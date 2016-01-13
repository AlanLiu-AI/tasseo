var period = 60;
var refresh = 1 * 60 * 1000;
var usingCloudWatch = true;

var cpuThresholdWarning = 50.0;
var cpuThresholdCritical = 80.0;
var memMbTransform = function (value) {
    return value / 1024 / 1024
};


var region = 'us-east-1';
var elb1Name = 'GaiaSM-Prod-ELB1';
var elb2Name = 'GaiaSM-Prod-ELB2';
var ec2Instance1Id = 'i-86ef0755';
var ec2Machine1 = 'GaiaSM-Prod-Node1-us-east-1a';
var ec2Instance2Id = 'i-bf4f0c16';
var ec2Machine2 = 'GaiaSM-Prod-Node2-us-east-1d';
var rdsInstanceId = 'gaiasm-production';
var gaiaSmApp = 'Gaia-SM App';
var environment = 'Prod';

var getElb1HealthyCountLink = function(elb1Name) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D05!E03!ET7!MN4!NS2!PD1!SS6!ST0!VA-PT12H10M~3600~AWS%252FELB~' + elb1Name +
        '~HealthyHostCount~LoadBalancerName~Minimum~P0D';
};
var getElb1RequestCountLink = function(elb1Name) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D04!E03!ET5!MN6!NS2!PD1!SS7!ST0!VA-PT12H~3600~AWS%252F' + elb1Name +
        '~LoadBalancerName~P0D~RequestCount~Sum';
};
var getElb1LatencyLink = function(elb1Name) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D06!E04!ET7!MN5!NS2!PD1!SS3!ST0!VA-PT12H49M~3600~AWS%252FELB~Average~' + elb1Name +
        '~Latency~LoadBalancerName~P0D';
};
var getElb2HealthyCountLink = function(elb2Name) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D05!E03!ET7!MN4!NS2!PD1!SS6!ST0!VA-PT12H10M~3600~AWS%252FELB~' + elb2Name +
        '~HealthyHostCount~LoadBalancerName~Minimum~P0D';
};
var getElb2RequestCountLink = function(elb2Name) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D04!E03!ET5!MN6!NS2!PD1!SS7!ST0!VA-PT12H~3600~AWS%252F' + elb2Name +
        '~LoadBalancerName~P0D~RequestCount~Sum';
};
var getElb2LatencyLink = function(elb2Name) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D06!E04!ET7!MN5!NS2!PD1!SS3!ST0!VA-PT12H49M~3600~AWS%252FELB~Average~' + elb2Name +
        '~Latency~LoadBalancerName~P0D';
};

var getEc2InstanceCpuLink = function(instanceId) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D05!E07!ET6!MN4!NS2!PD1!SS3!ST0!VA-PT12H51M~3600~AWS%252FEC2~Average~CPUUtilization' +
        '~InstanceId~P0D~' + instanceId;
};
var getEc2InstanceMemUsedLink = function(instanceIp) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D08!D19!D211!D313!E012!E17!E21!E310!ET6!MN5!NS4!PD2!SS3!ST0!VA-PT12H51M~' + instanceIp +
        '~3600~Average~Gaia-SM%2BApp~JVM.MemoryUsage~P0D~' + environment +
        '~category~environment~gauge~machine~total.used~type';
};
var getRdsInstanceCpuLink = function(instanceId) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!AX7!D05!E08!ET6!MN4!NS2!PD1!SS3!ST0!VA-PT12H51M~3600~AWS%252FRDS~' +
        'Average~CPUUtilization~DBInstanceIdentifier~P0D~RIGHT~' + instanceId;
};
var getRdsInstanceReadIOPSLink = function(instanceId) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D03!E07!ET5!MN6!NS2!PD1!SS4!ST0!VA-PT12H51M~3600~AWS%252FRDS~DBInstanceIdentifier~' +
        'Maximum~P0D~ReadIOPS~' + instanceId;
};
var getRdsInstanceWriteIOPSLink = function(instanceId) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!AX6!D03!E08!ET5!MN7!NS2!PD1!SS4!ST0!VA-PT12H51M~3600~AWS%252FRDS~DBInstanceIdentifier~' +
        'Maximum~P0D~RIGHT~WriteIOPS~' + instanceId;
};
var getApiResponseCountLink = function() {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D07!D19!E06!E18!ET5!MN2!NS4!PD1!SS3!ST0!VA-PT13H29M~3600~API.responseLatency~' +
        'Average~Gaia-SM%2BApp~P0D~' + environment + '~environment~timerCount~type';
};
var getApiResponseLatencyTimerLink= function(statsCode) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D07!D19!E06!E18!ET5!MN2!NS4!PD1!SS3!ST0!VA-PT13H29M~3600~API.responseLatency~' + statsCode +
        '~Gaia-SM%2BApp~P0D~' + environment + '~environment~timerSet~type';
};
var getResourceResponseCountLink = function(resource) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D08!D19!D211!E07!E11!E210!ET6!MN3!NS5!PD2!SS4!ST0!VA-PT13H29M~%252Fapi%252Fv1%252F' + resource +
        '~3600~API.responseLatency~Average~Gaia-SM%2BApp~P0D~' + environment + '~environment~path~timerCount~type';
};
var getResourceResponseLatencyTimerLink= function(resource, statsCode) {
    return 'https://console.aws.amazon.com/cloudwatch/home?region=' + region +
        '#metrics:graph=!D08!D19!D211!E07!E11!E210!ET6!MN3!NS5!PD2!SS4!ST0!VA-PT13H29M~%252Fapi%252Fv1%252F' + resource +
        '~3600~API.responseLatency~' + statsCode + '~Gaia-SM%2BApp~P0D~' + environment + '~environment~path~timerSet~type';
};

var metrics = [
    {	target: 'ELB1.HealthyHost Min(cnt)',
        Namespace: 'AWS/ELB', 'MetricName': 'HealthyHostCount',
        link: getElb1HealthyCountLink(elb1Name),
        warning: 1, critical: 0,
        Statistics: ['Minimum'],
        Dimensions: [
            {Name: 'LoadBalancerName', Value: elb1Name}
        ] },
    {	target: 'ELB1.Requests Sum(cnt)',
        Namespace: 'AWS/ELB', 'MetricName': 'RequestCount',
        link: getElb1RequestCountLink(elb1Name),
        Statistics: ['Sum'],
        Dimensions: [
            {Name: 'LoadBalancerName', Value: elb1Name}
        ] },
    { 	target: 'ELB1.Latency Avg(s)',
        Namespace: 'AWS/ELB', MetricName: 'Latency',
        link: getElb1LatencyLink(elb1Name),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'LoadBalancerName', Value: elb1Name}
        ] },
    {	target: 'ELB2.HealthyHost Min(cnt)',
        Namespace: 'AWS/ELB', 'MetricName': 'HealthyHostCount',
        link: getElb2HealthyCountLink(elb2Name),
        warning: 1, critical: 0,
        Statistics: ['Minimum'],
        Dimensions: [
            {Name: 'LoadBalancerName', Value: elb2Name}
        ] },
    {	target: 'ELB2.Requests Sum(cnt)',
        Namespace: 'AWS/ELB', 'MetricName': 'RequestCount',
        link: getElb2RequestCountLink(elb2Name),
        Statistics: ['Sum'],
        Dimensions: [
            {Name: 'LoadBalancerName', Value: elb2Name}
        ] },
    { 	target: 'ELB2.Latency Avg(s)',
        Namespace: 'AWS/ELB', MetricName: 'Latency',
        link: getElb2LatencyLink(elb2Name),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'LoadBalancerName', Value: elb2Name}
        ] },
    { 	target: 'Server1.CPU Avg(%)',
        warning: cpuThresholdWarning, critical: cpuThresholdCritical,
        Namespace: 'AWS/EC2', MetricName: 'CPUUtilization',
        link: getEc2InstanceCpuLink(ec2Instance1Id),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'InstanceId', Value: ec2Instance1Id}
        ] },
    { 	target: 'Server1.Mem total.used Average(mb)',
        Namespace: gaiaSmApp, MetricName: 'JVM.MemoryUsage',
        link: getEc2InstanceMemUsedLink(ec2Machine1),
        Statistics: ['Average'],
        transform: memMbTransform,
        Dimensions: [
            {Name: 'type', Value: 'gauge'},
            {Name: 'category', Value: 'total.used'},
            {Name: 'machine', Value: ec2Machine1},
            {Name: 'environment', Value: environment},
        ] },
    { 	target: 'Server2.CPU Avg(%)',
        warning: cpuThresholdWarning, critical: cpuThresholdCritical,
        Namespace: 'AWS/EC2', MetricName: 'CPUUtilization',
        link: getEc2InstanceCpuLink(ec2Instance2Id),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'InstanceId', Value: ec2Instance2Id}
        ] },
    { 	target: 'Server2.Mem total.used Average(mb)',
        Namespace: gaiaSmApp, MetricName: 'JVM.MemoryUsage',
        link: getEc2InstanceMemUsedLink(ec2Machine2),
        Statistics: ['Average'],
        'transform': memMbTransform,
        Dimensions: [
            {Name: 'type', Value: 'gauge'},
            {Name: 'category', Value: 'total.used'},
            {Name: 'machine', Value: ec2Machine2},
            {Name: 'environment', Value: environment},
        ] },
    { 	target: 'RDS.CPU Avg(%)',
        warning: cpuThresholdWarning, critical: cpuThresholdCritical,
        Namespace: 'AWS/RDS', MetricName: 'CPUUtilization',
        link: getRdsInstanceCpuLink(rdsInstanceId),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'DBInstanceIdentifier', Value: rdsInstanceId}
        ] },
    { 	target: 'RDS.ReadIOPS Max(cnt/s)',
        Namespace: 'AWS/RDS', MetricName: 'ReadIOPS',
        Statistics: ['Maximum'],
        link: getRdsInstanceReadIOPSLink(rdsInstanceId),
        Dimensions: [
            {Name: 'DBInstanceIdentifier', Value: rdsInstanceId}
        ] },
    { 	target: 'RDS.WriteIOPS Max(cnt/s)',
        Namespace: 'AWS/RDS', MetricName: 'WriteIOPS',
        link: getRdsInstanceWriteIOPSLink(rdsInstanceId),
        Statistics: ['Maximum'],
        Dimensions: [
            {Name: 'DBInstanceIdentifier', Value: rdsInstanceId}
        ] },
    { 	target: 'API.Responses Avg(Cnt)',
        Namespace: gaiaSmApp, MetricName: 'API.responseLatency',
        link: getApiResponseCountLink(),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'type', Value: 'timerCount'},
            {Name: 'environment', Value: environment}
        ] },
    { 	target: 'API.Response.Latency Avg(ms)',
        Namespace: gaiaSmApp, MetricName: 'API.responseLatency',
        link: getApiResponseLatencyTimerLink('Average'),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'type', Value: 'timerSet'},
            {Name: 'environment', Value: environment}
        ] },
    { 	target: 'API.Response.Latency Max(ms)',
        Namespace: gaiaSmApp, MetricName: 'API.responseLatency',
        link: getApiResponseLatencyTimerLink('Maximum'),
        Statistics: ['Maximum'],
        Dimensions: [
            {Name: 'type', Value: 'timerSet'},
            {Name: 'environment', Value: environment}
        ] },
    { 	target: '/api/v1/observations Count Avg(Cnt)',
        Namespace: gaiaSmApp, MetricName: 'API.responseLatency',
        link: getResourceResponseCountLink('observations'),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'type', Value: 'timerCount'},
            {Name: 'path', Value: '/api/v1/observations'},
            {Name: 'environment', Value: environment}
        ] },
    { 	target: '/api/v1/observations Latency Avg(ms)',
        Namespace: gaiaSmApp, MetricName: 'API.responseLatency',
        link: getResourceResponseLatencyTimerLink('observations', 'Average'),
        Statistics: ['Average'],
        Dimensions: [
            {Name: 'type', Value: 'timerSet'},
            {Name: 'path', Value: '/api/v1/observations'},
            {Name: 'environment', Value: environment}
        ] },
    { 	target: '/api/v1/observations Latency Max(ms)',
        Namespace: gaiaSmApp, MetricName: 'API.responseLatency',
        link: getResourceResponseLatencyTimerLink('observations', 'Maximum'),
        Statistics: ['Maximum'],
        Dimensions: [
            {Name: 'type', Value: 'timerSet'},
            {Name: 'path', Value: '/api/v1/observations'},
            {Name: 'environment', Value: environment}
        ] },
]
