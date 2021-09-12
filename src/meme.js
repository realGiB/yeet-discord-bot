const fs = require('fs');

export function namify(msg, nicknameCallback, response) {
  let n = 0;
  const {guild} = msg;
  const names = {};
  guild.members.fetch()
      .then((members) => {
        members.filter((member) => member.manageable)
            .each((member) => {
              names[member.id] = member.nickname;
              member.setNickname(nicknameCallback(n));
              n++;
            });
        fs.writeFileSync('data/nicknames.json', JSON.stringify(names));
      })
      .then(() => {
        if (response) msg.channel.send(`\`${response}\``);
      })
      .catch((err) => {
        console.error(err);
        n--;
      });
}

export function denamify(msg, response) {
  const {guild} = msg;
  const nicknames = JSON.parse(fs.readFileSync('data/nicknames.json'));
  guild.members.fetch()
      .then((members) => members.filter((member) => member.manageable)
          .each((member) => {
            if (nicknames[member.id]) {
              member.setNickname(nicknames[member.id])
                  .catch(console.error);
            } else {
              member.setNickname(member.user.username)
                  .catch(console.error);
            }
          }))
      .then(() => {
        if (response) msg.channel.send(`\`${response}\``);
      })
      .catch(console.error);
}
