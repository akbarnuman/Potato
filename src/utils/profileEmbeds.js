const { EmbedBuilder } = require('discord.js');

function overviewEmbed(username, profile) {
  const embed = new EmbedBuilder()
    .setTitle(`${username}'s Reading Profile`)
    .setColor(0x5865f2)
    .addFields(
      { name: '📚 Currently Reading', value: profile.current?.bookTitle || 'Nothing right now', inline: false },
      { name: '✔ Completed Books', value: `${profile.stats.booksCompleted}`, inline: true },
      { name: '📝 Wishlist', value: `${profile.wishlist.length}`, inline: true },
      { name: '🔥 Current Streak', value: `${profile.streak.currentStreak}`, inline: true },
      { name: '🏆 Longest Streak', value: `${profile.streak.longestStreak}`, inline: true },
      { name: '📄 Total Pages Read', value: `${profile.stats.totalPagesRead}`, inline: true },
      { name: '⭐ Favorite Genre', value: profile.favoriteGenre, inline: true },
      { name: '📅 Reading Since', value: profile.joinedAt.toDateString(), inline: false }
    );

  if (profile.badges.length > 0) {
    embed.addFields({ name: 'Badges', value: profile.badges.map((b) => `${b.emoji} ${b.name}`).join('\n') });
  }
  if (profile.wishlist.length > 0) {
    const preview = profile.wishlist.slice(0, 5).map((w) => w.bookTitle).join(', ');
    embed.addFields({ name: 'Wishlist Preview', value: preview });
  }

  return embed;
}

function currentBookEmbed(username, profile) {
  if (!profile.current) {
    return new EmbedBuilder().setTitle(`${username}'s Current Book`).setDescription('Nothing in progress right now.');
  }
  const percent = Math.round((profile.current.currentPage / profile.current.totalPages) * 100);
  return new EmbedBuilder()
    .setTitle(profile.current.bookTitle)
    .setColor(0x5865f2)
    .addFields(
      { name: 'Progress', value: `${percent}%`, inline: true },
      { name: 'Current Page', value: `${profile.current.currentPage}`, inline: true },
      { name: 'Started On', value: profile.current.startDate.toDateString(), inline: true }
    );
}

function completedBooksEmbed(username, profile) {
  if (profile.history.length === 0) {
    return new EmbedBuilder().setTitle(`${username}'s Completed Books`).setDescription('No books completed yet.');
  }
  const list = profile.history.slice(0, 10)
    .map((h) => `**${h.bookTitle}** — completed ${h.completedDate.toDateString()}`)
    .join('\n');
  return new EmbedBuilder().setTitle(`${username}'s Completed Books`).setColor(0x57f287).setDescription(list);
}

function wishlistEmbed(username, profile) {
  if (profile.wishlist.length === 0) {
    return new EmbedBuilder().setTitle(`${username}'s Wishlist`).setDescription('Wishlist is empty.');
  }
  const list = profile.wishlist.map((w, i) => `${i + 1}. ${w.bookTitle}`).join('\n');
  return new EmbedBuilder().setTitle(`${username}'s Wishlist`).setColor(0xfee75c).setDescription(list);
}

function statsEmbed(username, profile) {
  return new EmbedBuilder()
    .setTitle(`${username}'s Reading Stats`)
    .setColor(0xeb459e)
    .addFields(
      { name: 'Books Completed', value: `${profile.stats.booksCompleted}`, inline: true },
      { name: 'Total Pages Read', value: `${profile.stats.totalPagesRead}`, inline: true },
      { name: 'Current Streak', value: `${profile.streak.currentStreak}`, inline: true },
      { name: 'Longest Streak', value: `${profile.streak.longestStreak}`, inline: true },
      { name: 'Favorite Genre', value: profile.favoriteGenre, inline: true }
    );
}

module.exports = { overviewEmbed, currentBookEmbed, completedBooksEmbed, wishlistEmbed, statsEmbed };