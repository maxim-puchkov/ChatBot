// ChatBot Service 12
// CBS12 Alexandra
//
// Copyright (c) 2014-2019 Maxim Puchkov. All rights reserved.
// cbs12.js, cbsData.js


// Gerty1234 telegram Койот-1552

// https://chatvdvoem.ru/
// https://vk.com/vdvoemplusplus





// ==VPPScript==
// @name                Alexandra
// @description         ChatBot Service 12 (CBS12)
// @version             12.0.0
// @version-compatible  2.1.11+
// @browser-compatible    chrome
// @release-date        Dec 31, 2018
// @locale              enGB
// @system              macOS
// @predecessor         CBS11 Keira
// ==/VPPScript





/*
    Comments to modify or remove:
        CBS11 UNMODIFIED COMMENT
        EMPTY COMMENT
        INCOMPLETE OBJECT
        OBSOLETE OBJECT
*/

/*
    CBS12 Version Changelog

        v12.0.0:
            - Comments added to most outer objects and functions
            - "Comments to modify" section
            - Style consistency
            - Timer added: Bot.Chat.time
            - Service name changed: Keira to Alexandra
            - Data name changed: Keira VSSD to CBSVSSD

*/



/*

s1 = сам ! самА
s2 = ебанутЫЙ ! ебанутАЯ
s3 = идиот ! идиотКА
s4 = задолбалСЯ ! задолбалАСЬ
s5 = ебан ! ебанУШКА
s6 = пидор ! пидорАСКА
s7 = школьниК ! школьниЦА
s8 = мудаК ! мудаЧКА

*/


var User  = {

    Sex: {
        suffixes: {
            "s1" : ["", "а"],
            "s2" : ["ый", "ая"],
            "s3" : ["", "ка"],
            "s4" : ["ся", "ась"],
            "s5" : ["", "ушка"],
            "s6" : ["", "аска"],
            "s7" : ["к", "ца"],
            "s8" : ["к", "чка"]
        }
    },

};



// EMPTY COMMENT
var Bot = {

    // Object holding session information: time when service had begun,
    // uptime, unique user list, encounters in order.
    // INCOMPLETE OBJECT
    session: {

        timestamp: new Date(),

        encounters: [],

        users: [],

        countForId: function(id) {
            var count = 0;
            for (var i = 0; i < this.encounters.length; i++) {
                if (this.encounters[i] == id) count++;
            }
            return count;
        },

        init: function() {
            var ts = new Date();
            this.timestamp = ts.toLocaleTimeString();
        },

    },





    // Data object with properties' values storing service's name, version,
    // compatibility, social media, and other less relevant information.
    data: {

        name: VPPScript.meta['name'],
        description: VPPScript.meta['description'],
        version: VPPScript.meta['version'],
        versionCompatible: VPPScript.meta['version-compatible'],
        browserCompatible: VPPScript.meta['browser-compatible'],
        date: VPPScript.meta['release-date'],
        locale: VPPScript.meta['locale'],
        system: VPPScript.meta['system'],
        predecessor: VPPScript.meta['predecessor'],

        fullName: function() {
            return this.name + " v." + this.version;
        },

        fullVersion: function() {
            return this.name + " v." + this.version + " (" + this.versionCompatible + ")";
        },

        systems: {
            "macOS": {
                voices: {
                    Russian: 62,
                    English: 49
                }
            },
            "Windows": {
                voices: {
                    Russian: 16,
                    English: 3
                }
            }
        },

        social: {
            vk: {
                base: "https://vk.com/",
                id: "id397017964",
                url: function() {
                    return this.base + this.id;
                },
                profileImage: null
            },
            phone: "",
            name: {
                first: "Василий",
                last: "Гандюк",
                full: function() {
                    return this.first + " " + this.last;
                },
                update: function(first, last) {
                    this.first = first;
                    this.last = last;
                }
            },
            skype: "degama93",
            city: "Москва",
            dateOfBirth: {
                day: 16,
                month: 5,
                year: 2003,
                months: [
                    "января", "февраля", "марта", "апреля",
                    "мая", "июня", "июля", "августа",
                    "сентября", "октября", "ноября", "декабря"
                ],
                full: function() {
                    return this.day + " " + this.months[this.month - 1] + " " + this.year;
                },
                fullUnformatted: function() {
                    return this.month + "/" + this.day + "/" + this.year;
                },
                update: function(day, month, year) {
                    if (day) this.day = parseFloat(day);
                    if (month) this.month = parseFloat(month);
                    if (year) this.year = parseFloat(year);
                }
            },
            age: function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDay();
                var age = year - this.dateOfBirth.year;
                if ((this.dateOfBirth.month == (month + 1)
                    && day > this.dateOfBirth.day)
                    || ((month + 1) > this.dateOfBirth.month))
                {
                    age += 1;
                }
                return age;
            }
        },

    },






    // Parser allows parsing VK and text messages, as well as special parsing
    // of linked VK (Bot.data.social.vk.id)
    parser: {

        linkedVk: function() {
            VPP.ajax({
                url: Bot.data.social.vk.url(),
                success: function(result) {
                    if (result === "error") {
                        Bot.say("Invalid URL");
                        return;
                    }

                    var name =
                        result.match(/<h2 class="page_name">([A-ZА-Я\s]+)(?:<a.*a>)*<\/h2>/i);
                    if (name && name[1]) {
                        var firstName = name[1].substring(0, name[1].indexOf(" "));
                        var lastName = name[1].substring(name[1].indexOf(" ") + 2, name[1].lastIndexOf(""));
                        Bot.data.social.name.update(firstName, lastName);
                    }
                    var city =
                        result.match(/<a href="\/search\?c\[name\]=(?:.*)&c\[section\]=(?:.*)&c\[country\]=(?:.*)&c\[city\]=(?:.*)">(.*)<\/a>/i);
                    if (city && city[1]) {
                        Bot.data.social.city = city[1];
                    }
                    var phone =
                        result.match(/<div class="label fl_l">Моб\. телефон:<\/div>\s*<div class="labeled">(.*)<\/div>/i);
                    if (phone && phone[1]) {
                        Bot.data.social.phone = phone[1];
                    }
                    var skype =
                        result.match(/<a href="skype:(?:.*)">(.*)<\/a>/i);
                    if (skype && skype[1]) {
                        Bot.data.social.skype = skype[1];
                    }
                    var birthDayMonth =
                        result.match(/<a href="\/search\?c\[section\]=(?:.*)&c\[bday\]=(.*)&c\[bmonth\]=(.*)">(?:\d+\s+[а-я]+)<\/a>/i);
                    if (birthDayMonth && birthDayMonth[1] && birthDayMonth[2]) {
                        Bot.data.social.dateOfBirth.update(birthDayMonth[1], birthDayMonth[2], null);
                    }
                    var birthYear =
                        result.match(/<a href="\/search\?c\[section\]=(?:.*)&c\[byear\]=(?:.*)">(\d{4})\s+г\.<\/a>/i);
                    if (birthYear && birthYear[1]) {
                        Bot.data.social.dateOfBirth.update(null, null, birthYear[1]);
                    }
                    var profileImage =
                        result.match(/.*img class="page_avatar_img" src="(.*)" alt=".*/i);
                    if (profileImage && profileImage[1]) {
                        Bot.data.social.vk.profileImage = profileImage[1];
                    }
                    var index = UI.getPanelIndex("Social");
                    UI.updatePanelInfo(index, [
                        Bot.data.social.vk.url(),
                        Bot.data.social.name.full(),
                        Bot.data.social.phone,
                        Bot.data.social.skype,
                        Bot.data.social.city,
                        Bot.data.social.dateOfBirth.full(),
                        Bot.data.social.vk.profileImage ? true : false
                    ]);
                    UI.updatePanel(index);
                }
            });
        },

        vk: function(chat, id) {
            var makeUrl = function(id) {
                var base = "https://vk.com/";
                return base + id;
            };
            VPP.ajax({
                url: makeUrl(id),
                success: function(result) {
                    var invalidUrl = function() {
                        var title = result.match(/<title>(.*)<\/title>/i);
                        var invalidTitles = [
                            "Новости", "News", "Добро пожаловать | ВКонтакте", "Welcome&#33; | VK"
                        ];
                        for (var i = 0; i < invalidTitles.length; i += 1) {
                            if (invalidTitles[i] === title[1]) return true;
                        }
                        return false;
                    };
                    if (result === "error" || invalidUrl()) {
                        Bot.say("Error");
                        return;
                    }

                    var name =
                        result.match(/<h2 class="page_name">([A-ZА-Я\s]+)(?:<a.*a>)*<\/h2>/i);
                    if (name && name[1]) {
                        var firstName = name[1].substring(0, name[1].indexOf(" "));
                        var lastName = name[1].substring(name[1].indexOf(" ") + 2, name[1].lastIndexOf(""));
                        //chat.user.data.social.name.update(firstName, lastName);

                        chat.log("Name: " + firstName + " " + lastName);
                    }
                    var city =
                        result.match(/<a href="\/search\?c\[name\]=(?:.*)&c\[section\]=(?:.*)&c\[country\]=(?:.*)&c\[city\]=(?:.*)">(.*)<\/a>/i);
                    if (city && city[1]) {
                        //chat.user.social.city = city[1];

                        chat.log("City: " + city[1]);
                    }
                    var phone =
                        result.match(/<div class="label fl_l">Моб\. телефон:<\/div>\s*<div class="labeled">(.*)<\/div>/i);
                    if (phone && phone[1]) {
                        //chat.user.social.phone = phone[1];
                        chat.log("Phone: " + phone[1]);
                    }
                    var skype =
                        result.match(/<a href="skype:(?:.*)">(.*)<\/a>/i);
                    if (skype && skype[1]) {
                        //chat.user.social.skype = skype[1];
                        chat.log("Skype: " + skype[1]);
                    }
                    var birthDayMonth =
                        result.match(/<a href="\/search\?c\[section\]=(?:.*)&c\[bday\]=(.*)&c\[bmonth\]=(.*)">(?:\d+\s+[а-я]+)<\/a>/i);
                    if (birthDayMonth && birthDayMonth[1] && birthDayMonth[2]) {
                        //chat.user.social.dateOfBirth.update(birthDayMonth[1], birthDayMonth[2], null);
                        chat.log("Birth Day Month: " + birthDayMonth[1] + " " + birthDayMonth[2]);
                    }
                    var birthYear =
                        result.match(/<a href="\/search\?c\[section\]=(?:.*)&c\[byear\]=(?:.*)">(\d{4})\s+г\.<\/a>/i);
                    if (birthYear && birthYear[1]) {
                        //chat.user.social.dateOfBirth.update(null, null, birthYear[1]);
                        chat.log("Birth year: " + birthYear[1]);
                    }
                    var profileImage =
                        result.match(/.*img class="page_avatar_img" src="(.*)" alt=".*/i);
                    if (profileImage && profileImage[1]) {
                        //chat.user.social.vk.profileImage = profileImage[1];

                        chat.log("Profile image: " + profileImage[1]);
                    }
                }
            });
        },

        text: function(chat, str) {
            var flags = {
                vk: {
                    regex: /.*vk\.com\/([\w]+).*/i,
                    completion: function() {
                        Bot.parser.vk(chat.assignee, this.match[1]);
                        chat.status.increase(5);
                    }
                },
                phone: {
                    regex: /.*((?:\+7|8)9(\d+)).*/i,
                    completion: function() {
                        Bot.say("phone");
                        Bot.log(chat.assignee, "This is a PHONE");
                        chat.status.increase(1);
                    }
                },
                // testing
                yes: {
                    regex: /^да$/i,
                    completion: function() {
                        //Bot.log(chat.assignee, "This is a YES");
                    }
                },
                // testing
                male: {
                    regex: /^[mм]$/i,
                    completion: function() {
                        //Bot.log(chat.assignee, "This is a MALE");
                        chat.status.decrease(3);
                    }
                },
                bot: {
                    regex: /.*(?:[^я]|^)(?:[^\а-я]|^)+((?:ро)?[bб]\s?[о@o0Q\*]+\s?[tт]+[sы]*(?:и+к+)*|про+гр*а+м*а*)(?:[^\б-нп-ю]|$)+.*/i,
                    completion: function() {
                        if (!chat.compromised) {
                            chat.compromised = true;
                            Bot.say("Chat " + (chat.index + 1) + " has been compromised");
                            Bot.modules.global.Statistics.compromised += 1;
                        }
                        UI.updateStatisticsProperty("Chats Compromised", Bot.modules.global.Statistics.compromised);
                        UI.updateStatisticsProperty("Compromise Rate", Bot.modules.global.Statistics.compromiseRate());
                        //if (chat.status < 4) Bot.say("User Action Required");
                        //Bot.say("Identity compromised");
                        //Bot.log(chat.assignee, "Identity compromised");
                        chat.status.decrease(1);
                    }
                },
            };
            for (var key in flags) {
                var flag = flags[key];
                var result = str.match(flag.regex);
                if (result) {
                    flag.match = result;
                    flag.completion();
                }
            }
        },

    },





    // Global modules:
    //         Transform - string manipulation
    //        Statistics - gather relevant info to display in UI panels
    // Chat (local) modules:
    //        Analysis - INCOMPLETE OBJECT
    //        Security - protects from frequent concerning messages aimed to
    //                             interrupt required purpose of the service
    //        Communication - main module that interacts with users by choosing
    //                                        relevant messages to be sent
    //        Calculator - evaluate messages of type "2*2", "two times two",
    //                                 or "two x two"
    modules: {

        global: {

            Transform: {

                initialCap: function(str) {
                    var first = str.substr(0, 1);
                    str = first.toUpperCase() + str.substr(1);
                    return str;
                },

                allCaps: function(str) {
                    return str.toUpperCase();
                },

                isNumeric: function(str) {
                    return !isNaN(str);
                }

            },

            Statistics: {

                started: 0,
                terminated: 0,
                compromised: 0,
                messagesSent: 0,
                messagesReceived: 0,
                textReceived: 0,
                imagesReceived: 0,
                stickersReceived: 0,

                terminationRate: function() {
                    return ((this.terminated / this.started) * 100).toPrecision(3) + "%";
                },

                compromiseRate: function() {
                    return ((this.compromised / this.started) * 100).toPrecision(3) + "%";
                },

                sentReceivedRatio: function() {
                    return (this.messagesSent / this.messagesReceived).toPrecision(4);
                },

                textRatio: function() {
                    return ((this.textReceived / this.messagesReceived) * 100).toPrecision(3) + "%";
                },

                imageRatio: function() {
                    return ((this.imagesReceived / this.messagesReceived) * 100).toPrecision(3) + "%";
                },

                stickerRatio: function() {
                    return ((this.stickersReceived / this.messagesReceived) * 100).toPrecision(3) + "%";
                },

                avgSentPerChat: function() {
                    return (this.messagesSent / this.started).toPrecision(3);
                },

                avgReceivedPerChat: function() {
                    return (this.messagesReceived / this.started).toPrecision(3);
                }

            },

        },

        chat: {

            core: [

                function(c) {
                    return new Bot.modules.chat.Analysis(c);
                },

                function(c) {
                    return new Bot.modules.chat.Security(c);
                },

                function(c) {
                    return new Bot.modules.chat.Communication(c);
                },

                function(c) {
                    return new Bot.modules.chat.Calculator(c);
                }

            ],

            Analysis: function(cbsChat) {
                this.run = function() {
                    // INCOMPLETE OBJECT
                }
            },

            Security: function(cbsChat) {
                var self = this;

                this.chat = cbsChat;
                var statusValue = this.chat.status.value;
                var statusExtra = (statusValue - 5) > 0 ? statusValue - 5 : 0;
                var history = self.chat.history.received;

                this.concerns = {
                    multipleNumericEntries: {
                        name: "Multiple numeric entries",
                        count: 4,
                        minLength: function() { return this.count + statusExtra; },
                        maxLength: function() { return Infinity; },
                        check: function() {
                            var condition = true;
                            for (var i = 0; i < this.count + statusExtra; i += 1) {
                                condition = (Bot.modules.global.Transform.isNumeric(history[history.length - 1 - i].content));
                                if (!condition) break;
                            }
                            return condition;
                        },
                        resolve: function() {
                            self.chat.terminate();
                        }
                    },
                    multipleDuplicateEntries: {
                        name: "Multiple duplicate entries",
                        count: 4,
                        minLength: function() { return this.count + statusExtra; },
                        maxLength: function() { return Infinity; },
                        check: function() {
                            var condition = true;
                            var msg = history[history.length - 1];
                            for (var i = 1; i < this.count + statusExtra; i += 1) {
                                condition = msg.content == history[history.length - 1 - i].content;
                                if (!condition) break;
                            }
                            return condition;
                        },
                        resolve: function() {
                            self.chat.terminate();
                        }
                    },
                    entryUrl: {
                        name: "URL found within first ten messages",
                        count: 1,
                        minLength: function() { return 1; },
                        maxLength: function() { return 10; },
                        check: function() {
                            var regex =
                                /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
                            return regex.test(history[history.length - 1].content) && history[history.length - 1].type === 0;
                        },
                        resolve: function() {
                            self.chat.terminate();
                        }
                    },
                    multipleStickers: {
                        name: "Multiple stickers",
                        count: 3,
                        minLength: function() { return this.count + statusExtra; },
                        maxLength: function() { return Infinity; },
                        check: function() {
                            var condition = true;
                            for (var i = 0; i < this.count + statusExtra; i += 1) {
                                condition = history[history.length - 1 - i].type == 2;
                                if (!condition) break;
                            }
                            return condition;
                        },
                        resolve: function() {
                            self.chat.terminate();
                        }
                    },
                    excessiveStickers: {
                        name: "Excessive stickers",
                        count: 10,
                        minLength: function() { return this.count + statusExtra; },
                        maxLength: function() { return 70; },
                        check: function() {
                            var stickerCount = 0;
                            for (var i = 0; i < this.count + statusExtra; i += 1) {
                                if (history[history.length - 1 - i].type == 2) stickerCount += 1;
                            }
                            return (stickerCount > 5);
                        },
                        resolve: function() {
                            self.chat.terminate();
                        }
                    },
                    initialMessageTooLong: {
                        name: "Initial message is too long",
                        count: 1,
                        minLength: function() { return 1; },
                        maxLength: function() { return 1; },
                        check: function() {
                            return history[0].content.length > 100;
                        },
                        resolve: function() {
                            self.chat.terminate();
                        }
                    }
                    /*
                    tooFast: {
                        name: "Delay is too short",
                        count: 2,
                        warn: true,
                        minLength: function() {
                            return 2;
                        },
                        maxLength: function() {
                            return Infinity;
                        },
                        lengthValid: function(val) {
                            return (val >= this.minLength() && val <= this.maxLength());
                        },
                        check: function() {
                            console.warn("Delay is", self.chat.time.afterLastMessage);
                            return (self.chat.time.afterLastMessage < 0.2);
                        }
                    }
                    */
                };

                this.run = function() {
                    var lengthValid = function(concern, value) {
                        return (value >= concern.minLength() && value <= concern.maxLength());
                    };
                    for (var key in this.concerns) {
                        var concern = this.concerns[key];
                        if (lengthValid(concern, history.length)) {
                            concern.check() && concern.resolve();
                        }
                    }

                    if (self.chat.status.value <= 0) {
                        //Bot.say("Chat requires termination");
                        self.chat.terminate();
                    }
                };

            },

            Communication: function(cbsChat) {
                var self = this;
                this.chat = cbsChat;

                this.selectRandomMessage = function(messageGroup) {
                    //console.info(messageGroup);
                    //var index = Math.floor(Math.random() * (messageGroup.length - 1)) + 1;
                    //console.info(index);
                    //var ret = messageGroup[index];
                    var ret = Bot.select(messageGroup, 1);
                    //console.info(ret);
                    return ret;
                }

                this.run = function() {
                    //var m = self.selectRandomMessage(Bot.messages.unmatched);
                    //Bot.log(self.chat.assignee, m, true);
                    //self.chat.sendMessage(m);
                    //console.warn("com runs");


                    // Reply to pattern
                    for (var i = 0; i < Bot.patterns.length; i++) {
                        var r = new RegExp(Bot.patterns[i][0], "i");
                        if (r.test(self.chat.history.lastReceived().content)) {
                            var group = self.selectRandomMessage(Bot.patterns[i]);
                            var reply = group;
                            if (Array.isArray(group)) {
                                reply = self.selectRandomMessage(group);
                            }
                            console.log("Reply: " + reply);
                            break;
                            //self.chat.sendMessage("Keira v.11.0.8: " + reply);
                        } else {
                            //console.log("Test failed: " + self.chat.history.lastReceived().content);
                            //console.log("R: " + r);
                            //console.log(self.chat);
                        }
                    }

                    //console.log("Run complete");
                }
            },

            Calculator: function(cbsChat) {

                var self = this;
                this.chat = cbsChat;

                this.run = function(s) {

                    var inputToEquation = function(input) {
                        var numbers = {
                            "0": /(н[оу]ль|zero)/g,
                            "1": /([оа]ди+н|one)/g,
                            "2": /(два+|two+)/g,
                            "3": /(три+|thre+)/g,
                            "4": /(ч[еи]т[ыи]р[еи]|four)/g,
                            "5": /(пя+ть*|five+)/g,
                            "6": /(ше+сть|six)/g,
                            "8": /(восе+мь|eight)/g,
                            "7": /(се+мь|se+ve+n)/g,
                            "9": /(дев[яие]ть|nine)/g,
                            "10": /(дес[яие]ть|ten)/g,
                            "300": /((тр[ие]|3З)ст[ао]|(three|3З) hundred)/g,
                        };
                        var operations = {
                            "+": /(±|п+л[юа]с+|пр[ие]б[ао]в[ие]ть?|д[оа]б[ао]в[ие]ть?|plus+|ad+)/g,
                            "-": /(–|—|минус|отбавить|отнять|удалить|subtract|minus)/g,
                            "*": /(×|x|х|умножить на|умножить|multipl(y|ied( by)?)|times)/g,
                            "/": /(÷|разделить на|поделить на|делить на|divide|over)/g,
                        };
                        var limit = {
                            max: 1e8,
                            min: -1e8
                        };
                        var removeOtherSymbols = function(input) {
                            var regex = /[^\d\+\-\*\/]/g;
                            return input.replace(regex, "");
                        };
                        var equation = input;
                        for (var key in operations) {
                            var alt = operations[key];
                            equation = equation.replace(alt, key);
                        }
                        for (var key in numbers) {
                            var alt = numbers[key];
                            equation = equation.replace(alt, key);
                        }
                        return removeOtherSymbols(equation);
                    };

                    var input = s || self.chat.history.last().content;
                    var answer;
                    try {
                        var equation = inputToEquation(input);
                        answer = eval(equation);
                    } catch (e) {
                        if (self.chat && self.chat.assignee) {
                            Bot.log(self.chat.assignee, "Cannot solve: " + e);
                            console.warn(e);
                        }
                    }

                    // answer evaluated
                    // Set next message (calc)

                }

            }

        }

    },





    // Adds UI, parses linked VK, and initiates English and Russian communication
    // speech synthesis for the specified system meta-property.
    start: function() {
        console.log(this.data.fullVersion() + " is starting...");
        console.log(this);
        UI.add();
        this.parser.linkedVk();
        this.say("", true);
        this.sayRu("", true);
        console.log("Start completed");

        var numImages = VPP.gallery.size();
        //this.say(numImages + "images in the gallery");
        console.log(numImages + " images in the gallery");
    },





    // Say something in English
    say: function(str, forced) {
        if (this.configuration.voice || forced) {
            var msg = new SpeechSynthesisUtterance();
            var voices = window.speechSynthesis.getVoices();
            var voiceNum = Bot.data.systems[Bot.data.system].voices.English;
            msg.voice = voices[voiceNum];
            msg.text = str;
            speechSynthesis.speak(msg);
        }
    },





    // Say something in Russian
    sayRu: function(str, forced) {
        if (this.configuration.voice || forced) {
            var msg = new SpeechSynthesisUtterance();
            var voices = window.speechSynthesis.getVoices();
            var voiceNum = Bot.data.systems[Bot.data.system].voices.Russian;
            msg.voice = voices[voiceNum];
            msg.text = str;
            speechSynthesis.speak(msg);
        }
    },





    // Configuration defaults
    configuration: {
        verbose: false,
        voice: true,
        locked: false
    },





    // All events that need to be handled in VPP Chat
    events: {
        connect: "connected",
        disconnect: "disconnected",
        messageReceived: "messageReceived",
        messageDelivered: "messageDelivered"
    },




    // Shared storage updates
    updates: {
        message_list: "message_list"
    },





    // Logs a message in a specified chat
    log: function(chat, msg, forced, visible, unlabeled) {
        var l = this.data.fullVersion() + ": ";
        var label = unlabeled ? "" : l;
        (forced || this.configuration.verbose) && chat.log(label + msg);
        visible && chat.sendLongMessage(label + msg);
    },





    // EMPTY COMMENT
    termiate: function(chat) {
        Bot.modules.global.Statistics.terminated += 1;
        UI.updateStatisticsProperty("Chats Terminated", Bot.modules.global.Statistics.terminated);
        UI.updateStatisticsProperty("Termination Rate", Bot.modules.global.Statistics.terminationRate());
        chat.close();
    },





    // EMPTY COMMENT
    updateMessageStatistics: function() {
        var s = this.modules.global.Statistics;
        UI.updateStatisticsProperty("Messages Sent",        s.messagesSent);
        UI.updateStatisticsProperty("Total Received",       s.messagesReceived);
        UI.updateStatisticsProperty("Sent/Received Ratio",  s.sentReceivedRatio());
        UI.updateStatisticsProperty("Text Received",        s.textReceived);
        UI.updateStatisticsProperty("Text Ratio",           s.textRatio());
        UI.updateStatisticsProperty("Images Received",      s.imagesReceived);
        UI.updateStatisticsProperty("Image Ratio",          s.imageRatio());
        UI.updateStatisticsProperty("Stickers Received",    s.stickersReceived);
        UI.updateStatisticsProperty("Sticker Ratio",        s.stickerRatio());
        UI.updateStatisticsProperty("Avg Sent/Chat",        s.avgSentPerChat());
        UI.updateStatisticsProperty("Avg Received/Chat",    s.avgReceivedPerChat());
    },





    // OBSOLETE OBJECT
    // ChatService 10 (CS10) Obsolete class
    Behaviour: function() {
        this.all = {
            calm: {
                name: "calm",
                associate: ["calm_msg1", "calm_msg2"],
                limit: 4
            }
        };
    },





    // EMPTY COMMENT
    Chat: function(index, chat) {
        var self = this;

        this.assignee = chat;
        this.id = chat.chatId;
        this.index = index;

        this.blocked = false;
        this.compromised = false;
        this.readMessages = false;

        //this.behaviour = new Bot.Behaviour();
        this.modules = [];

        this.time = {

            total: 0,
            afterLastMessage: 0,
            afterLastReceived: 0,
            afterLastDelivered: 0,
            started: false,

            afterLastMessageFormatted: function() {
                return this.afterLastMessage.toPrecision(2);
            },

            start: function() {

                console.info("Chat timer started");
                console.info(this);
                var self = this;
                var interval = 100; // 100ms = 0.1s
                setInterval(function() {
                    self.started = true;
                    self.total += interval;
                    self.afterLastMessage += interval;
                    self.afterLastReceived += interval;
                    self.afterLastDelivered += interval;
                }, interval);

            }
        };

        this.history = {

            received: [],
            sent: [],
            lastMessage: null,

            addReceived: function(msg) {
                this.received.push(msg);
                this.lastMessage = msg;
            },

            addSent: function(msg) {
                this.sent.push(msg);
                this.lastMessage = msg;
            },

            isReceived: function() {
                this.received.forEach(function(msg) {
                    // ?
                });
            },

            isSent: function() {
                this.sent.forEach(function(msg) {
                    // ?
                });
            },

            last: function() {
                return this.lastMessage;
            },

            lastReceived: function() {
                return this.received[this.received.length - 1];
            },

            lastSent: function() {
                return this.sent[this.sent.length - 1];
            }

        };

        this.status = {
            max: 10,
            min: 0,
            step: 1,
            statuses: [
                "Horrible", "Very bad", "Bad", "Slightly bad", "Below average", "Average",
                "Above average", "Good", "Very good", "Incredible", "Outstanding"
            ],
            defaultValue: 8,
            value: 8,
            reset: function() {
                this.value = this.defaultValue;
            },
            increase: function(val) {
                if (this.value < this.max) this.value += (val || step);
                if (this.value > this.max) this.value = this.max;
                Bot.log(self.assignee, "status is now " + this.value + " (" + this.asString() + ")", true);
            },
            decrease: function(val) {
                if (this.value > this.min) this.value -= (val || step);
                if (this.value < this.min) this.value = this.min;
                Bot.log(self.assignee, "status is now " + this.value + " (" + this.asString() + ")", true);
            },
            asString: function() {
                return this.statuses[this.value];
            }
        };

        this.messageReceived = function(type, content) {
            switch (type) {
                case VPP.Chat.MessageType.TEXT:
                    Bot.parser.text(this, content);
                    Bot.modules.global.Statistics.textReceived += 1;
                    if (this.readMessages) Bot.sayRu(content);
                    break;
                case VPP.Chat.MessageType.STICKER:
                    Bot.modules.global.Statistics.stickersReceived += 1;
                    break;
                case VPP.Chat.MessageType.IMAGE:
                    Bot.log(chat, "MESSAGE_RECEIVED_IMAGE", true);
                    Bot.modules.global.Statistics.imagesReceived += 1;
                    Bot.say("Received image");

                    try {
                        var image = new VPP.Image(content);
                        image.onLoad = function() {
                            var numImages = VPP.gallery.add(image);
                            Bot.log(chat, numImages, true);
                        }
                    } catch (e) {
                        Bot.log(self.assignee, e);
                        console.warn(e);
                    }
                    break;
            }

            Bot.modules.global.Statistics.messagesReceived += 1;
            Bot.updateMessageStatistics();

            //Bot.log(self.assignee, "Running: " + self.time.started + "; Total: " + self.time.total + "; After last: " + self.time.afterLastMessageFormatted());

            //Bot.log(self.assignee, "Total: " + (self.time.total/1000) + "s, ALM: " + self.time.afterLastMessage, true, false, true);
            //Bot.log(self.assignee, "ALR: " + self.time.afterLastReceived + ", ALD: " + self.time.afterLastDelivered, true, false, true);
            Bot.log(self.assignee, "T: " + (self.time.total/1000) + "s, ALM: " + (self.time.afterLastMessage/1000) + "s, ALR: " + (self.time.afterLastReceived/1000) + "s, ALD: " + self.time.afterLastDelivered/1000 + "s", false, false, true);



            this.time.afterLastMessage = 0;
            this.time.afterLastReceived = 0;
            this.history.addReceived({type: type, content: content});
            this.runModules();
        };

        this.messageDelivered = function(type, content) {
            //Bot.log(self.assignee, "Total: " + (self.time.total/1000) + "s, ALM: " + self.time.afterLastMessage, true, false, true);
            //Bot.log(self.assignee, "ALR: " + self.time.afterLastReceived + ", ALD: " + self.time.afterLastDelivered, true, false, true);
            Bot.log(self.assignee, "Total: " + (self.time.total/1000) + "s, ALM: " + (self.time.afterLastMessage/1000) + "s, ALR: " + (self.time.afterLastReceived/1000) + "s, ALD: " + self.time.afterLastDelivered/1000 + "s", false, false, true);

            this.time.afterLastDelivered = 0;
            this.history.addSent({type: type, content: content});
            if (this.readMessages) Bot.sayRu(content);
        };

        this.sendMessage = function(str) {
            self.assignee.sendLongMessage(str);
        };

        this.addModule = function(mod) {
            this.modules.push(mod);
        };

        this.addCoreModules = function() {
            var self = this;
            Bot.modules.chat.core.forEach(function(Module) {
                var chatModule = new Module(self);
                self.addModule(chatModule);
            });
        };

        this.runModules = function() {
            this.modules.forEach(function(mod) {
                mod.run();
            });
        };

        this.terminate = function() {
            Bot.modules.global.Statistics.terminated += 1;
            UI.updateStatisticsProperty("Chats Terminated", Bot.modules.global.Statistics.terminated);
            UI.updateStatisticsProperty("Termination Rate", Bot.modules.global.Statistics.terminationRate());
            UI.updateStatisticsProperty("Chats Compromised", Bot.modules.global.Statistics.terminated);
            UI.updateStatisticsProperty("Compromise Rate", Bot.modules.global.Statistics.compromiseRate());
            self.assignee.close();
        };

    },





    // EMPTY COMMENT
    chats: {

        all: [],

        total: function() {
            return this.all.length;
        },

        start: function(index, chat) {
            var newChat = new Bot.Chat(index, chat);
            newChat.time.start();
            if (this[index]) delete this[index];
            this[index] = newChat;
            this.all.push(newChat.id);
            newChat.addCoreModules();
            newChat.assignee.nickname = Bot.selectNickname();

            // Opp

            Bot.session.encounters.push(newChat.assignee.nicknameOpp);
            if (Bot.session.countForId(newChat.assignee.nicknameOpp) == 1) {
                Bot.session.users.push(newChat.assignee.nicknameOpp);
            }

            Bot.log(chat, newChat.assignee.nickname + " / " + newChat.assignee.nicknameOpp + " (" + Bot.session.countForId(newChat.assignee.nicknameOpp) + ")", true);


        }

    },





    // EMPTY COMMENT
    selectNickname: function() {
        return this.select(this.nicknames);
    },





    // EMPTY COMMENT
    select: function(array, shift) {
        if (!shift) shift = 0;
        var index = Math.floor(Math.random() * (array.length - shift)) + shift;
        var selection = array[index];
        if (selection) return selection;
        return "Selection error: 01";
    }

};









// EMPTY COMMENT
var UI = {

    data: {
        prefix: "cbs-",
        id: Bot.data.name,
        view: document.getElementById("vpp2-options").getElementsByClassName("options-block")[1],
        container: null
    },

    panels: [
        [Bot.data.fullName(), [
            ["Description", Bot.data.description],
             ["VPP Compatible", Bot.data.versionCompatible],
            ["Browser Compatible", Bot.data.browserCompatible],
            ["Release Date", Bot.data.date],
            ["Locale", Bot.data.locale],
            ["System", Bot.data.system],
            ["Predecessor", Bot.data.predecessor]
            ]
        ],
        ["Social", [
            ["VK", null],
            ["Name", null],
            ["Phone", null],
            ["Skype", null],
            ["Residence", null],
            ["DOB", null],
            ["Profile Image", null]
            ]
        ],
        ["Statistics", [
            ["Chats Started", 0],
            ["Chats Terminated", 0],
            ["Termination Rate", 0],
            ["Chats Compromised", 0],
            ["Compromise Rate", 0],
            ["Messages Sent", 0],
            ["Total Received", 0],
            ["Sent/Received Ratio", 0],
            ["Text Received", 0],
            ["Text Ratio", 0],
            ["Images Received", 0],
            ["Image Ratio", 0],
            ["Stickers Received", 0],
            ["Sticker Ratio", 0],
            ["Avg Sent/Chat", 0],
            ["Avg Received/Chat", 0]
            ]
        ]
    ],

    resetView: function() {
        this.data.view.innerHTML = null;
    },

    add: function() {
        this.resetView();
        var div = document.createElement("div");
        div.setAttribute("id", this.data.prefix + this.data.id);
        this.data.view.appendChild(div);
        this.data.container = div;
        this.addPanels();
    },

    makePanelElement: function(panelData) {
        var el = document.createElement("h2");
        var name = document.createElement("span");
        name.innerHTML = panelData[0] + ": ";
        var content = document.createElement("span");
        content.setAttribute("id", this.data.prefix + panelData[0]);
        content.innerHTML = (panelData[1] || (typeof panelData[1] == "number" ? 0 : "unknown"));
        el.appendChild(name);
        el.appendChild(content);
        return el;
    },

    addPanels: function() {
        for (var i = 0; i < this.panels.length; i += 1) {
            var title = this.panels[i][0];
            var div = document.createElement("div");
            div.setAttribute("id", this.data.prefix + title);
            var header = document.createElement("h1");
            header.innerHTML = title;
            div.appendChild(header);
            var panelData = this.panels[i][1];
            for (var k = 0; k < panelData.length; k += 1) {
                var el = this.makePanelElement(panelData[k]);
                div.appendChild(el);
            }
            this.data.container.appendChild(div);
        }
    },

    getPanelIndex: function(panelName) {
        for (var i = 0; i < this.panels.length; i += 1) {
            if (this.panels[i][0] === panelName) return i;
        }
    },

    getContentElement: function(propertyName) {
        return document.getElementById(this.data.prefix + propertyName);
    },

    updatePanelInfo: function(index, arr) {
        for (var i = 0; i < this.panels[index][1].length; i += 1) {
            if (arr[i]) this.panels[index][1][i][1] = arr[i];
        }
    },

    updatePanel: function(index) {
        var panel = this.panels[index];
        var div = document.getElementById(this.data.prefix + panel[0]);
        div.innerHTML = null;
        var title = panel[0];
        var header = document.createElement("h1");
        header.innerHTML = title;
        div.appendChild(header);
        var panelData = panel[1];
        for (var i = 0; i < panelData.length; i += 1) {
            var el = this.makePanelElement(panelData[i]);
            div.appendChild(el);
        }
    },

    updateStatisticsProperty: function(propertyName, statistic) {
        var index = this.getPanelIndex("Statistics");
        var panel = this.panels[index];
        for (var i = 0; i < panel[1].length; i += 1) {
            if (panel[1][i][0] === propertyName) {
                var el = this.getContentElement(propertyName);
                panel[1][i][1] = statistic;
                el.innerHTML = panel[1][i][1];
            }
        }
    },

    free: function() {
        this.data.container.parentElement.removeChild(this.data.container);
    }

};
























// EMPTY COMMENT
VPP.chats.forEach(function(chat, index) {

    chat.setAutoStart(true);

    // CBS11 UNMODIFIED COMMENT
    /* Events */
    chat.addEventListener(VPP.Chat.Event.CONNECTED, Bot.events.connect, function() {
        Bot.chats.start(index, chat);
        Bot.modules.global.Statistics.started += 1;
        UI.updateStatisticsProperty("Chats Started", Bot.modules.global.Statistics.started);
        UI.updateStatisticsProperty("Termination Rate", Bot.modules.global.Statistics.terminationRate());
        Bot.log(chat, "CONNECTED");
    });

    chat.addEventListener(VPP.Chat.Event.DISCONNECTED, Bot.events.disconnect, function() {
        Bot.log(chat, "DISCONNECTED");
    });

    chat.addEventListener(VPP.Chat.Event.MESSAGE_RECEIVED, Bot.events.messageReceived, function(type, content) {
        Bot.log(chat, "MESSAGE_RECEIVED");
        var CBSChat = Bot.chats[index];
        CBSChat.messageReceived(type, content);
    });

    chat.addEventListener(VPP.Chat.Event.MESSAGE_DELIVERED, Bot.events.messageDelivered, function(type, content) {
        Bot.log(chat, "MESSAGE_DELIVERED");
        Bot.modules.global.Statistics.messagesSent += 1;
        Bot.updateMessageStatistics();
        var CBSChat = Bot.chats[index];
        CBSChat.messageDelivered(type, content);
    });
    /* Events end */


    // CBS11 UNMODIFIED COMMENT
    /* Configuration Settings */
    chat.verbose = function(val) {
        Bot.configuration.verbose = val === "1";
        console.info("Configuration changed: verbose");
        Bot.say("Configuration changed: verbose");
    };
    chat.verbose.description = "Not verbose/Verbose";

    chat.locked = function(val) {
        Bot.configuration.locked = val === "1";
        console.info("Configuration changed: locked");
        Bot.say("Configuration changed: locked");
    };
    chat.locked.description = "Unlock/lock";

    chat.voice = function(val) {
        Bot.configuration.voice = val === "1";
        console.info("Configuration changed: voice");
        Bot.say("Configuration changed: voice");
    };
    chat.voice.description = "Mute/Voice";
    /* Configuration Settings end */



    chat.say = function(str) {
        Bot.say(str);
    };
    chat.say.description = "Voice module";

    chat.sayRu = function(str) {
        Bot.sayRu(str);
    };
    chat.sayRu.description = "Voice module (Russian)";

    chat.console = function() {
        console.info(bot);
    };
    chat.console.description = "Display bot in developer console (⌥⌘I)";

    chat.status = function() {
        var CBSChat = Bot.chats[index];
        Bot.say("Chat's status is" + CBSChat.status.asString());
    };
    chat.status.description = "Notify of chat's current status";

    chat.readMessages = function(val) {
        var CBSChat = Bot.chats[index];
        CBSChat.readMessages = val === "1";
    };
    chat.readMessages.description = "Read all messages in this chat when set"

    chat.config = function() {
        var CBSChat = Bot.chats[index];
        for (var key in this.concerns) {
            var configurator = Bot.configuration[key];
            CBSChat.log(configurator)
        }
    };
    chat.config.description = "Display all possible configurations"


    // CBS11 UNMODIFIED COMMENT
    // Debug
    chat.i = function(str) {
        var CBSChat = Bot.chats[index];
        Bot.parser.text(CBSChat, str);
    };

    chat.hr = function(str) {
        var CBSChat = Bot.chats[index];
        CBSChat.history.received.push({type: 0, content: str});
        CBSChat.runModules();
    };

    chat.setst = function(val) {
        var CBSChat = Bot.chats[index];
        CBSChat.status.value = val;
    };

    chat.calc = function(str) {
        var calc = new Bot.modules.chat.Calculator(null);
        calc.run(str);
    };

    chat.ratio = function() {
        var el = Bot.session.encounters.length;
        var ul = Bot.session.users.length;
        var CBSChat = Bot.chats[index];
        CBSChat.log(ul + "/" + el);
    };

});





// EMPTY COMMENT
VPPScript.stop = function() {
    VPP.chats.forEach(function(chat) {
        chat.removeEventListener(Bot.events.connect);
        chat.removeEventListener(Bot.events.disconnect);
        chat.removeEventListener(Bot.events.messageDelivered);
        chat.removeEventListener(Bot.events.messageReceived);
        chat.setAutoStart(false);
    });
};





// EMPTY COMMENT
VPP.sharedStorage.addUpdateListener(Bot.updates.message_list, function(keys) {
    switch (keys) {
        case "messages":
            console.info("OK: Messages key.");
            Bot.messages = this.get(keys);
            console.info(Bot.messages);
            break;
        case "nicknames":
            console.info("OK: Nicknames key.");
            Bot.nicknames = this.get(keys);
            break;
        case "patterns":
            console.info("OK: Patterns key.");
            Bot.patterns = this.get(keys);
            console.info(Bot.patterns);
            break;
    }
});





Bot.start();
