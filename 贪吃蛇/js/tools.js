(function () {
    var Tools = {
        getRandom: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }
    //暴露tools给外部访问
    window.Tools = Tools;
})();