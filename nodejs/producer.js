const {
  MQClient,
  MessageProperties
} = require('@aliyunmq/mq-http-sdk');

// 设置HTTP接入域名（此处以公共云生产环境为例）
const endpoint = "${HTTP_ENDPOINT}";
// AccessKey 阿里云身份验证，在阿里云服务器管理控制台创建
const accessKeyId = "${ACCESS_KEY}";
// SecretKey 阿里云身份验证，在阿里云服务器管理控制台创建
const accessKeySecret = "${SECRET_KEY}";

var client = new MQClient(endpoint, accessKeyId, accessKeySecret);

// 所属的 Topic
const topic = "${TOPIC}";
// Topic所属实例ID，默认实例为空
const instanceId = "${INSTANCE_ID}";

const producer = client.getProducer(instanceId, topic);

(async function(){
  try {
    // 循环发送4条消息
    for(var i = 0; i < 4; i++) {
      let res;
      if (i % 2 == 0) {
        msgProps = new MessageProperties();
        // 设置属性
        msgProps.putProperty("a", i);
        // 设置KEY
        msgProps.messageKey("MessageKey");
        res = await producer.publishMessage("hello mq.", "", msgProps);
      } else {
        msgProps = new MessageProperties();
        // 设置属性
        msgProps.putProperty("a", i);
        // 定时消息, 定时时间为10s后
        msgProps.startDeliverTime(Date.now() + 10 * 1000);
        res = await producer.publishMessage("hello mq. timer msg!", "TagA", msgProps);
      }
      console.log("Publish message: MessageID:%s,BodyMD5:%s", res.body.MessageId, res.body.MessageBodyMD5);
    }

  } catch(e) {
    // 消息发送失败，需要进行重试处理，可重新发送这条消息或持久化这条数据进行补偿处理
    console.log(e)
  }
})();
