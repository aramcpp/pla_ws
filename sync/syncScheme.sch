# the schemes of notification type tables

# friends table
create table friends(friendshipID varchar(36) NOT NULL, fromFriendID varchar(36) NOT NULL, toFriendID varchar(36) NOT NULL, status text NOT NULL, PRIMARY KEY (friendshipID)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# email table
create table email(emailID varchar(36) NOT NULL, fromUserID varchar(36) NOT NULL, toUserID varchar(36) NOT NULL, postCardID text NOT NULL, status text NOT NULL, PRIMARY KEY (emailID)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# userSettings
create table userSettings(userid varchar(36) NOT NULL, myLanguage text NOT NULL, username text NOT NULL, birthday text NOT NULL, avatar text NOT NULL, learningLanguage text NOT NULL, password text NOT NULL, parentEMail text NOT NULL, PRIMARY KEY (userid)) ENGINE=InnoDB DEFAULT CHARSET=utf8;