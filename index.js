const { time } = require('console');
const Discord = require('discord.js');
const { resolve } = require('path');
const { send } = require('process');
const fs = require('fs');
const path = require('path');
const { isNumber } = require('util');
const sqlite3 = require('sqlite3').verbose();

const client = new Discord.Client();
const guild = new Discord.GuildMember();

//--------------------------------------

var JSON_PATH = 'nexus_server_friend/setup.json';

let rawdata = fs.readFileSync(JSON_PATH);
let botSet = JSON.parse(rawdata)



var prefix = botSet["prefix"];




client.once('ready', () => {
    console.log('Hazır!');
    console.log(client.user.tag)
    client.user.setActivity(prefix + 'komutlar', { type: 'PLAYING' })
        .then(presence => console.log(`Bot Aktivitesi Olarak ' ${presence.activities[0].name} ' Ayarlandı.`))
        .catch(console.error);

});

client.on('message', message => {
    var wants = message.content.toLowerCase();
    if (!message.author.bot) {
        if (wants === prefix + 'komutlar') {
            const komutEmbed = {
                color: botSet['color'],
                title: "Yardım",
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL(),
                },
                description: 'Aktif Komutlar',
                thumbnail: {
                    url: client.user.avatarURL(),
                },
                fields: [
                    {
                        name: prefix + "temizle & " + prefix + "clear",
                        value: "50 adet mesajı siler.",
                        inline: true,
                    },
                    {
                        name: prefix + "av",
                        value: "Geçerli avatarınızı getirir.",
                        inline: true,
                    },
                    {
                        name: prefix + "log @user bilgi",
                        value: "Bilgi yerine kullanıcı infosu girin.",
                        inline: true,
                    },
                    {
                        name: prefix + "av",
                        value: "Geçerli avatarınızı getirir.",
                        inline: true,
                    },
                ],

                timestamp: new Date(),
                footer: {
                    text: 'All Right Reserved',
                    icon_url: client.user.avatarURL(),
                },
            }
            message.channel.send({ embed: komutEmbed })
        } else if (wants === prefix + 'temizle' || wants === prefix + 'clear') {
            if (!(message.member.hasPermission('KICK_MEMBERS'))) {
                const hataYetkiEmbed = {
                    color: botSet["color"],
                    title: "Yetki Hatası",
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL(),
                    },
                    thumbnail: {
                        url: message.author.avatarURL(),
                    },
                    fields: [
                        {
                            name: "Size tanımlı yetki bulunamadı",
                            value: "Gereken yetki `KICK_MEMBERS` yetkiniz olduğu halde kullanamıyorsanız lütfen sunucu sahibi ile konuşunuz.",
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: 'All Right Reserved',
                        icon_url: client.user.avatarURL(),
                    },
                }
                message.channel.send({ embed: hataYetkiEmbed })
            } else {
                message.channel.bulkDelete(50, (err) => {
                    if (err) {
                        message.channel.send('14 Gün Kuralı')
                        throw err;
                    }
                })
            }
        } else if (wants.startsWith(prefix + 'av')) {
            message.channel.send(message.author.displayAvatarURL({ size: 512 }))
        } else if (wants.startsWith(prefix + "log")) {
            if (message.member.hasPermission('ADMINISTRATOR')) {
                var info = wants.replace(prefix + 'log', ' ');
                var count = 0;
                var idCounter = 0;
                var info_text = '';
                var isText = '';
                var infoList = [];
                let i, m, l;

                var user_ID_log = '';
                var user_info_log = '';

                for (i of info) {
                    if (!(i === ' ')) {
                        if (i === '0' || i === '1' || i === '2' || i === '3' || i === '4' || i === '5' || i === '6' || i === '7' || i === '8' || i === '9') {
                            if (idCounter === 18) {
                                break;
                            } else {
                                user_ID_log += String(i);
                                idCounter += 1;
                            }
                        }
                    }
                };
                var infoINinfo = info.replace(user_ID_log, '');
                infoINinfo = infoINinfo.replace('<@!', '');
                infoINinfo = infoINinfo.replace('>', '');

                if (infoINinfo === '  ') {
                    message.channel.send('boş')
                } else {
                    
                    var JSON_Veri = `
{
    "SavedBy" : "${message.author.id}",
    "UserID" : "${user_ID_log}",
    "UserInfo" : "${infoINinfo}",
    "UserAvatar" : "${client.users.fetch(user_ID_log).then((user)=>{return user.avatarURL({dynamic : true })})}"
}
                    `;


                    fs.lstat(`./user/${user_ID_log}.json`, function (err, stats) {
                        if (!err && stats.isFile()) {
                            message.channel.send('Kullanıcı Önceden kayıt edilmiş.\nBilgisine ulaşmak için `!find @user` komutunu kullanın.')
                        }
                        else {
                            fs.writeFile(`./user/${user_ID_log}.json`, JSON_Veri, (err) => {
                                if (err)
                                    console.log(err);
                                else {
                                    message.channel.send('Log oluşturuldu')
                                }
                            })
                        }
                    });
                }

            } else {
                const hataYetkiEmbed = {
                    color: botSet["color"],
                    title: "Yetki Hatası",
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL(),
                    },
                    thumbnail: {
                        url: message.author.avatarURL(),
                    },
                    fields: [
                        {
                            name: "Size tanımlı yetki bulunamadı",
                            value: "Gereken yetki `ADMINISTRATOR` yetkiniz olduğu halde kullanamıyorsanız lütfen sunucu sahibi ile konuşunuz.",
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: 'All Right Reserved',
                        icon_url: client.user.avatarURL(),
                    },
                }
                message.channel.send({ embed: hataYetkiEmbed })
            }

        } else if (wants.startsWith(prefix + "find")) {
            if (message.member.hasPermission('ADMINISTRATOR')) {
                var info = wants.replace(prefix + 'find', ' ');
                var idCounter = 0;
                var user_ID_log = '';

                for (i of info) {
                    if (!(i === ' ')) {
                        if (i === '0' || i === '1' || i === '2' || i === '3' || i === '4' || i === '5' || i === '6' || i === '7' || i === '8' || i === '9') {
                            if (idCounter === 18) {
                                break;
                            } else {
                                user_ID_log += String(i);
                                idCounter += 1
                            }
                        }
                    }
                };

                fs.lstat(`./user/${user_ID_log}.json`, function (err, stats) {
                    if (!err && stats.isFile()) {
                        var user_JSON = `./user/${user_ID_log}.json`;

                        let userdata = fs.readFileSync(user_JSON);
                        let userSet = JSON.parse(userdata);

                        const FindEmbed = {
                            color: botSet['color'],
                            title: "Kullanıcı Kaydı",
                            author: {
                                name: client.user.username,
                                icon_url: client.user.avatarURL(),
                            },
                            description: 'Kayıtlı Kullanıcı',
                            thumbnail: {
                                url: client.user.avatarURL(),
                            },
                            fields: [
                                {
                                    name:"Kullanıcı ID'si",
                                    value: userSet['UserID'],
                                    inline: false,
                                },
                                {
                                    name: "Kullanıcı Bilgisi",
                                    value: userSet['UserInfo'],
                                    inline: false,
                                },
                                {
                                    name: "Kayıt Eden",
                                    value: userSet['SavedBy'],
                                    inline: false,
                                }
                            ],
            
                            timestamp: new Date(),
                            footer: {
                                text: 'All Right Reserved',
                                icon_url: client.user.avatarURL(),
                            },
                        }
                        message.channel.send({ embed: FindEmbed })
                    }
                    else {
                        message.channel.send('Kullanıcı Önceden kayıt edilmemiş.\nKaydı oluşturmak için `!log @user bilgi` komutunu kullanın.')
                    }
                });
            } else {
                const hataYetkiEmbed = {
                    color: botSet["color"],
                    title: "Yetki Hatası",
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL(),
                    },
                    thumbnail: {
                        url: message.author.avatarURL(),
                    },
                    fields: [
                        {
                            name: "Size tanımlı yetki bulunamadı",
                            value: "Gereken yetki `ADMINISTRATOR` yetkiniz olduğu halde kullanamıyorsanız lütfen sunucu sahibi ile konuşunuz.",
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: 'All Right Reserved',
                        icon_url: client.user.avatarURL(),
                    },
                }
                message.channel.send({ embed: hataYetkiEmbed })
            }
        }
    }
});
client.login(botSet["Token"]);
