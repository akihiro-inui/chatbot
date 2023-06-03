import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const i18n = new I18n();

i18n.defaultLocale = "en";
i18n.locale = Localization.locale.split('-')[0]; // Get the language code
i18n.translations = {
  en: {
    drawer: {
      chatbot: "ChatBot",
      term: "Term of Service",
      privacypolicy: "Privacy Policy",
      deletehistory: "Delete Chat history"
    },
    share:{
      message: "Let's chat with the AI chatbot!",
      urlios: "https://apps.apple.com/us/app/chat-ai/id6448177940",
      urlandroid: "https://play.google.com/store/apps/details?id=com.swiftai.chatbot",
    },
    chat: {
      send: "Send",
      error: "An error occurred. Please try again later.",
      placeholder: "Please enter your message...",
      greeting: "Hello.\nPlease ask me questions like this:",
      example: "- What are the tips for brewing delicious tea?\
      \n- What are the pros and cons of ○○?\
      \n- Translate this email\
      \n- Recommend a fantacy novel\
      \n- Summarize this essay\
      \n- What are the tourist attractions in Paris? \
      ",
      warning: "If the chatbot response is too long and you can not see the whole response, please type 'continue' to see the next part of the response.",
      prompt: "Answer me shortly.",
    },
    delete: {
      confirmation: "Are you sure you want to delete the chat history?",
      title: "Success",
      yes: "Yes",
      no: "No",
      message: "Chat history has been deleted successfully."
    },
    subscription: {
      description: "Upgrade to premium plan to chat more!",
      popular: "Popular",
      limitedTitle: "Standard Plan",
      unlimitedTitle: "Unlimited Plan",
      limitedPrice: "$4.99 / month",
      unlimitedPrice: "$9.99 / month",
      limitedDescription: "Up to 100 times interaction with the chatbot per month",
      unlimitedDescription: "Unlimited interactions with the chatbot",
      restorePurchase: "Restore",
      restoredTitle: "Restored",
      restoredText: "Your purchase has been restored.",
      restoredFailedTitle: "Restore Failed",
      restoredFailedText: "We could not find any previous purchases to restore.",
      restoreFailedError: "An error occurred while trying to restore your purchases. Please try again later.",
      subscribe: "Subscribe",
      alreadySubscribedTitle: "You already have this subscription.",
      subscribedTitle: "Purchase successful!",
      subscribedText: "Your subscription has been activated.",
      subscribeFailedTitle: "Purchase failed",
      subscribeFailedText: "Your purchase could not be completed. Please try again later.",
    },
    term: {
      title: "Terms of Service",
      url: "https://swiftai.notion.site/Terms-of-Service-371c69ed141c4f98bc849db3687712c5"
    },
    privacy_policy: {
      title: "Privacy Policy",
      url: "https://swiftai.notion.site/Privacy-Policy-65eac8939426428a916fe277f233ff1d"
    }    
  },
  ja: {
    drawer: {
      chatbot: "ChatBot",
      term: "利用規約",
      privacypolicy: "プライバシーポリシー",
      deletehistory: "トーク履歴を削除"
    },
    share:{
      message: "最先端AIとチャットしてみよう！",
      urlios: "https://apps.apple.com/jp/app/chat-ai/id6448177940",
      urlandroid: "https://play.google.com/store/apps/details?id=com.swiftai.chatbot",
    },
    chat: {
      send: "送信",
      error: "エラーが発生しました。後ほどもう一度試してください。",
      placeholder: "メッセージを入力してください...",
      greeting: "例えばこんな風に聞いてみましょう",
      example: "\- 紅茶を美味しく淹れるコツは？\
      \n- ○○のメリットデメリットは？\
      \n- このメールを翻訳して\
      \n- おすすめの小説を教えて\
      \n- この文章を要約して\
      \n- パリの観光名所は？ \
      ",
      warning: "チャットボットの返信が長くて切れてしまう場合は、\
      \n「続けて」と送信してください。 \
      ",
      prompt: "250文字以内にまとめてください",
    },
    delete: {
      confirmation: "チャット履歴を削除する",
      yes: "はい",
      no: "いいえ",
      title: "成功",
      message: "チャット履歴を削除しました"
    },
    subscription: {
      description: "もっと会話を\n楽しもう！",
      popular: "人気のプラン",
      limitedTitle: "スタンダードプラン",
      unlimitedTitle: "無制限プラン",
      limitedPrice: "¥500 / 月",
      unlimitedPrice: "¥1200 / 月",
      limitedDescription: "月に100回までチャットボットと会話可能",
      unlimitedDescription: "チャットボットとの会話が無制限",
      restorePurchase: "復元",
      restoredTitle: "復元完了",
      restoredText: "購入が復元されました。",
      restoredFailedTitle: "復元失敗",
      restoredFailedText: "復元する以前の購入が見つかりませんでした。",
      restoreFailedError: "購入の復元中にエラーが発生しました。後でもう一度お試しください。",
      subscribe: "購入",
      alreadySubscribedTitle: "すでにこのプランに加入しています。",
      subscribedTitle: "購入成功！",
      subscribedText: "プランが有効になりました。",
      subscribeFailedTitle: "購入失敗",
      subscribeFailedText: "購入が完了できませんでした。後でもう一度お試しください。"
    },
    term: {
      title: "利用規約",
      url: "https://swiftai.notion.site/061ed6715d7f4c87b4f96d1d22773071"
    },
    privacy_policy: {
      title: "プライバシーポリシー",
      url: "https://swiftai.notion.site/785b9be490ff4f0499d1e037e7798bfb"
    }
  },
  zh: {
    drawer: {
      chatbot: "聊天机器人",
      term: "服务条款",
      privacypolicy: "隐私政策",
      deletehistory: "删除聊天记录"
    },
    share:{
      message: "来和AI聊天机器人聊天吧！",
      urlios: "https://apps.apple.com/us/app/chat-ai/id6448177940",
      urlandroid: "https://play.google.com/store/apps/details?id=com.swiftai.chatbot",
    },
    chat: {
      send: "发送",
      error: "发生错误。请稍后再试。",
      placeholder: "请输入你的消息...",
      greeting: "你好。\n请问我这样的问题：",
      example: "- 泡好茶的秘诀是什么？\
      \n- ○○的优缺点是什么？\
      \n- 翻译这封邮件\
      \n- 推荐一本奇幻小说\
      \n- 总结这篇文章\
      \n- 巴黎的旅游景点有哪些？ \
      ",
      warning: "如果聊天机器人的回复过长，你无法看到整个回复，\
      \n请输入'继续'来查看回复的下一部分。",
      prompt: "请简短回答我。",
    },
    delete: {
      confirmation: "你确定要删除聊天记录吗？",
      title: "成功",
      yes: "是",
      no: "否",
      message: "聊天记录已成功删除。"
    },
    subscription: {
      description: "升级到高级计划，聊得更多！",
      popular: "热门",
      limitedTitle: "标准计划",
      unlimitedTitle: "无限制计划",
      limitedPrice: " ¥22 / 月",
      unlimitedPrice: "¥58 / 月",
      limitedDescription: "每月与聊天机器人互动100次",
      unlimitedDescription: "与聊天机器人无限次互动",
      restorePurchase: "恢复",
      restoredTitle: "已恢复",
      restoredText: "你的购买已经恢复。",
      restoredFailedTitle: "恢复失败",
      restoredFailedText: "我们找不到任何可以恢复的以前的购买。",
      restoreFailedError: "尝试恢复你的购买时发生错误。请稍后再试。",
      subscribe: "订阅",
      alreadySubscribedTitle: "你已经有这个订阅了。",
      subscribedTitle: "购买成功！",
      subscribedText: "你的订阅已激活。",
      subscribeFailedTitle: "购买失败",
      subscribeFailedText: "你的购买无法完成。请稍后再试。",
    },
    term: {
      title: "使用条款",
      url: "https://swiftai.notion.site/843ed4d19daf4afdaaf4caa6c8896232"
    },
    privacy_policy: {
      title: "隐私政策",
      url: "https://swiftai.notion.site/3efe05d0fbb2436ca08781714eba7840"
    }
  },
  es: {
    drawer: {
      chatbot: "ChatBot",
      term: "Términos de Servicio",
      privacypolicy: "Política de Privacidad",
      deletehistory: "Eliminar historial de chat"
    },
    share:{
      message: "¡Chateemos con el chatbot de AI!",
      urlios: "https://apps.apple.com/us/app/chat-ai/id6448177940",
      urlandroid: "https://play.google.com/store/apps/details?id=com.swiftai.chatbot",
    },
    chat: {
      send: "Enviar",
      error: "Ocurrió un error. Por favor intenta de nuevo más tarde.",
      placeholder: "Por favor ingresa tu mensaje...",
      greeting: "Hola.\nPor favor hazme preguntas como estas:",
      example: "- ¿Cuáles son los consejos para preparar un delicioso té?\
      \n- ¿Cuáles son los pros y los contras de ○○?\
      \n- Traduce este correo electrónico\
      \n- Recomienda una novela de fantasía\
      \n- Resumen este ensayo\
      \n- ¿Cuáles son los lugares turísticos en París? \
      ",
      warning: "Si la respuesta del chatbot es demasiado larga y no puedes ver la respuesta completa,\
      \npor favor escribe 'continuar' para ver la siguiente parte de la respuesta.",
      prompt: "Respóndeme brevemente.",
    },
    delete: {
      confirmation: "¿Estás seguro de que quieres eliminar el historial de chat?",
      title: "Éxito",
      yes: "Sí",
      no: "No",
      message: "El historial de chat ha sido eliminado con éxito."
    },
    subscription: {
      description: "¡Actualiza al plan premium para chatear más!",
      popular: "Popular",
      limitedTitle: "Plan Estándar",
      unlimitedTitle: "Plan Ilimitado",
      limitedPrice: "€2.99 / mes",
      unlimitedPrice: "€8.99 / mes",
      limitedDescription: "Hasta 100 interacciones con el chatbot por mes",
      unlimitedDescription: "Interacciones ilimitadas con el chatbot",
      restorePurchase: "Restaurar",
      restoredTitle: "Restaurado",
      restoredText: "Tu compra ha sido restaurada.",
      restoredFailedTitle: "Restauración Fallida",
      restoredFailedText: "No pudimos encontrar ninguna compra anterior para restaurar.",
      restoreFailedError: "Ocurrió un error al intentar restaurar tus compras. Por favor intenta de nuevo más tarde.",
      subscribe: "Suscribirse",
      alreadySubscribedTitle: "Ya tienes esta suscripción.",
      subscribedTitle: "¡Compra exitosa!",
      subscribedText: "Tu suscripción ha sido activada.",
      subscribeFailedTitle: "Compra fallida",
      subscribeFailedText: "Tu compra no pudo ser completada. Por favor intenta de nuevo más tarde.",
    },
    term: {
      title: "Términos de Servicio",
      url: "https://swiftai.notion.site/T-rminos-de-Servicio-ab8039b3da6b44c3a3aa98d3b55e26cb"
    },
    privacy_policy: {
      title: "Política de Privacidad",
      url: "https://swiftai.notion.site/Pol-tica-de-Privacidad-9b51802513fc4a678c2716e825fd5fa5"
    }
  }
};

i18n.enableFallback = true;

export default i18n;
