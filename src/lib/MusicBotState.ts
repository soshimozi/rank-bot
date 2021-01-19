  
/**
 * Holds the bot's state. Contains any properties that may be important for when a command is executed, that can change.
 */
class MusicBotState {
    
    public stopped: boolean
    public informNowplaying: boolean
    public nowPlaying: {}
    public queue: any[]
    public aliases: {}
    public voiceConnection: any
    public voiceHandler: any
    public textChannel: any
    public voiceChannel: any
    public requiredRole: any

    constructor () {
      this.stopped = false
      this.informNowplaying = true
      this.nowPlaying = {}
      this.queue = []
      this.aliases = {}
      this.voiceConnection = null
      this.voiceHandler = null
      this.textChannel = null
      this.voiceChannel = null
      this.requiredRole = null
    }

    isQueueEmpty() {
        return !this.queue[0] || this.queue.length === 0;
    }

    isPlaying() {
        return this.voiceHandler !== null;
    }

  }
  
  /**
   * Singleton to prevent multiple instances of the MusicBotState from being instantiated.
   * @type {MusicBotState}
   */
  export default new MusicBotState()
