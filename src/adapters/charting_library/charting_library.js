!(function (e, t) {
  typeof exports === 'object' && typeof module !== 'undefined' ? t(exports)
  : typeof define === 'function' && define.amd ? define(['exports'], t)
  : t(((e = typeof globalThis !== 'undefined' ? globalThis : e || self).TradingView = {}));
})(this, (e) => {
  let t;
  let i;
  let o;
  let r;
  let n;
  let a;
  let s;
  let l;
  let d;
  let c;
  let h;
  let g;
  let u;
  let C;
  let S;
  let p;
  let m;
  let y;
  let _;
  let T;
  let b;
  let P;
  let L;
  let A;
  let w;
  let f;
  let v;
  let I;
  let O;
  let R;
  let D;
  let V;
  let k;
  let E;
  let F;
  let W;
  let M;
  let B;
  let N;
  let U;
  let x;
  let H;
  let j;
  let z;
  let G;
  let $;
  let J;
  let q;
  let K;
  let Z;
  let Q;
  let Y;
  let X;
  let ee;
  let te;
  let ie;
  let oe;
  let re;
  let ne;
  let ae;
  let se;
  let le;
  let de;
  let ce;
  let he;
  ((t = e.ActionId || (e.ActionId = {})).UnknownAction = 'UnknownAction'),
    (t.Spinner = 'Spinner'),
    (t.Loading = 'Loading'),
    (t.AlertAdd = 'Alert.Add'),
    (t.AlertEdit = 'Alert.Edit'),
    (t.AlertsClone = 'Alerts.Clone'),
    (t.AlertsRemove = 'Alerts.Remove'),
    (t.AlertsRemoveAll = 'Alerts.RemoveAll'),
    (t.AlertsRemoveFiltered = 'Alerts.RemoveFiltered'),
    (t.AlertsRemoveAllInactive = 'Alerts.RemoveAllInactive'),
    (t.AlertsRemoveFires = 'Alerts.RemoveFires'),
    (t.AlertsRestart = 'Alerts.Restart'),
    (t.AlertsRestartAllInactive = 'Alerts.RestartAllInactive'),
    (t.AlertsRestartFilteredInactive = 'Alerts.RestartFilteredInactive'),
    (t.AlertsStop = 'Alerts.Stop'),
    (t.AlertsStopAll = 'Alerts.StopAll'),
    (t.AlertsStopFilteredActive = 'Alerts.StopFilteredActive'),
    (t.AlertsExportFiresToCSV = 'Alerts.ExportFiresToCSV'),
    (t.AlertsLogClear = 'AlertsLog.Clear'),
    (t.ChartAddIndicatorToAllCharts = 'Chart.AddIndicatorToAllCharts'),
    (t.ChartAddSymbolToWatchList = 'Chart.AddSymbolToWatchList'),
    (t.ChartAlertLabelToggleExtendLines = 'Chart.AlertLabel.ToggleExtendLines'),
    (t.ChartApplyIndicatorsToAllCharts = 'Chart.ApplyIndicatorsToAllCharts'),
    (t.ChartIndicatorApplyChildIndicator = 'Chart.Indicator.ApplyChildIndicator'),
    (t.ChartIndicatorApplyFinancials = 'Chart.Indicator.ApplyFinancials'),
    (t.ChartIndicatorAbout = 'Chart.Indicator.About'),
    (t.ChartIndicatorPineLogs = 'Chart.Indicator.PineLogs'),
    (t.ChartIndicatorPineSource = 'Chart.Indicator.PineSource'),
    (t.ChartIndicatorAddFavorites = 'Chart.Indicator.AddFavorites'),
    (t.ChartChangeTimeZone = 'Chart.ChangeTimeZone'),
    (t.ChartClipboardCopyPrice = 'Chart.Clipboard.CopyPrice'),
    (t.ChartClipboardCopyLineTools = 'Chart.Clipboard.CopyLineTools'),
    (t.ChartClipboardCopySource = 'Chart.Clipboard.CopySource'),
    (t.ChartClipboardPasteSource = 'Chart.Clipboard.PasteSource'),
    (t.ChartCrosshairLockVerticalCursor = 'Chart.Crosshair.LockVerticalCursor'),
    (t.ChartCrosshairPlusButtonDrawHorizontalLine =
      'Chart.Crosshair.PlusButton.DrawHorizontalLine'),
    (t.ChartCustomActionId = 'Chart.CustomActionId'),
    (t.ChartDialogsShowChangeInterval = 'Chart.Dialogs.ShowChangeInterval'),
    (t.ChartDialogsShowChangeSymbol = 'Chart.Dialogs.ShowChangeSymbol'),
    (t.ChartDialogsShowCompareOrAddSymbol = 'Chart.Dialogs.ShowCompareOrAddSymbol'),
    (t.ChartDialogsShowGeneralSettings = 'Chart.Dialogs.ShowGeneralSettings'),
    (t.ChartDialogsShowGeneralSettingsLegendTab = 'Chart.Dialogs.ShowGeneralSettings.LegendTab'),
    (t.ChartDialogsShowGeneralSettingsSymbolTab = 'Chart.Dialogs.ShowGeneralSettings.SymbolTab'),
    (t.ChartDialogsShowGeneralScalesTab = 'Chart.Dialogs.ShowGeneralSettings.ScalesTab'),
    (t.ChartDialogsShowGeneralSettingsEventsAndAlertsTab =
      'Chart.Dialogs.ShowGeneralSettings.EventsAndAlertsTab'),
    (t.ChartDialogsShowGoToDate = 'Chart.Dialogs.ShowGoToDate'),
    (t.ChartDialogsShowInsertIndicators = 'Chart.Dialogs.ShowInsertIndicators'),
    (t.ChartDialogsShowInsertFinancials = 'Chart.Dialogs.ShowInsertFinancials'),
    (t.ChartDialogsShowSymbolInfo = 'Chart.Dialogs.ShowSymbolInfo'),
    (t.ChartDrawingToolbarToggleVisibility = 'Chart.DrawingToolbar.ToggleVisibility'),
    (t.ChartExternalActionId = 'Chart.ExternalActionId'),
    (t.ChartFavoriteDrawingToolsToolbarHide = 'Chart.FavoriteDrawingToolsToolbar.Hide'),
    (t.ChartIndicatorShowSettingsDialog = 'Chart.Indicator.ShowSettingsDialog'),
    (t.ChartLegendToggleLastDayChangeValuesVisibility =
      'Chart.Legend.ToggleLastDayChangeValuesVisibility'),
    (t.ChartLinkingGroupSync = 'Chart.LinkingGroupSync'),
    (t.ChartLinkingGroupSyncChangeGroup = 'Chart.LinkingGroupSync.ChangeGroup'),
    (t.ChartLegendToggleBarChangeValuesVisibility = 'Chart.Legend.ToggleBarChangeValuesVisibility'),
    (t.ChartLegendTogglePriceSourceVisibility = 'Chart.Legend.TogglePriceSourceVisibility'),
    (t.ChartLegendToggleIndicatorArgumentsVisibility =
      'Chart.Legend.ToggleIndicatorArgumentsVisibility'),
    (t.ChartLegendToggleIndicatorTitlesVisibility = 'Chart.Legend.ToggleIndicatorTitlesVisibility'),
    (t.ChartLegendToggleIndicatorValuesVisibility = 'Chart.Legend.ToggleIndicatorValuesVisibility'),
    (t.ChartLegendToggleOhlcValuesVisibility = 'Chart.Legend.ToggleOhlcValuesVisibility'),
    (t.ChartLegendToggleOpenMarketStatusVisibility =
      'Chart.Legend.ToggleOpenMarketStatusVisibility'),
    (t.ChartLegendToggleSymbolVisibility = 'Chart.Legend.ToggleSymbolVisibility'),
    (t.ChartLegendToggleVolumeVisibility = 'Chart.Legend.ToggleVolumeVisibility'),
    (t.ChartLines = 'Chart.Lines'),
    (t.ChartLinesToggleBidAskLinesVisibility = 'Chart.Lines.ToggleBidAskLinesVisibility'),
    (t.ChartLinesToggleHighLowLinesVisibility = 'Chart.Lines.ToggleHighLowLinesVisibility'),
    (t.ChartLinesToggleAverageLineVisibility = 'Chart.Lines.ToggleAverageLineVisibility'),
    (t.ChartLinesTogglePrePostMarketLineVisibility =
      'Chart.Lines.TogglePrePostMarketLineVisibility'),
    (t.ChartLinesTogglePrePostMarketPriceLineVisibility =
      'Chart.Lines.TogglePrePostMarketPriceLineVisibility'),
    (t.ChartLinesToggleSeriesPrevCloseLineVisibility =
      'Chart.Lines.ToggleSeriesPrevCloseLineVisibility'),
    (t.ChartLinesToggleSeriesPriceLineVisibility = 'Chart.Lines.ToggleSeriesPriceLineVisibility'),
    (t.ChartLineToolBarsPatternToggleFlipped = 'Chart.LineTool.BarsPattern.ToggleFlipped'),
    (t.ChartLineToolBarsPatternToggleMirrored = 'Chart.LineTool.BarsPattern.ToggleMirrored'),
    (t.ChartLineToolClone = 'Chart.LineTool.Clone'),
    (t.ChartLineToolCreateLimitOrderFromState = 'Chart.LineTool.CreateLimitOrderFromState'),
    (t.ChartLineToolElliotChangeDegreeProperty = 'Chart.LineTool.Elliot.ChangeDegreeProperty'),
    (t.ChartLineToolNoSync = 'Chart.LineTool.NoSync'),
    (t.ChartLineToolPitchforkChangeTypeToInside = 'Chart.LineTool.Pitchfork.ChangeTypeToInside'),
    (t.ChartLineToolPitchforkChangeTypeToModifiedSchiff =
      'Chart.LineTool.Pitchfork.ChangeTypeToModifiedSchiff'),
    (t.ChartLineToolPitchforkChangeTypeToOriginal =
      'Chart.LineTool.Pitchfork.ChangeTypeToOriginal'),
    (t.ChartLineToolPitchforkChangeTypeToSchiff = 'Chart.LineTool.Pitchfork.ChangeTypeToSchiff'),
    (t.ChartLineToolSyncInLayout = 'Chart.LineTool.SyncInLayout'),
    (t.ChartLineToolSyncGlobally = 'Chart.LineTool.SyncGlobally'),
    (t.ChartLineToolTemplates = 'Chart.LineTool.Templates'),
    (t.ChartLineToolTemplatesApply = 'Chart.LineTool.Templates.Apply'),
    (t.ChartLineToolTemplatesApplyDefaults = 'Chart.LineTool.Templates.ApplyDefaults'),
    (t.ChartLineToolTemplatesSaveAs = 'Chart.LineTool.Templates.SaveAs'),
    (t.ChartLineToolToolbarChangeFontSizeProperty =
      'Chart.LineTool.Toolbar.ChangeFontSizeProperty'),
    (t.ChartLineToolToolbarChangeLineStyleToDashed =
      'Chart.LineTool.Toolbar.ChangeLineStyleToDashed'),
    (t.ChartLineToolToolbarChangeLineStyleToDotted =
      'Chart.LineTool.Toolbar.ChangeLineStyleToDotted'),
    (t.ChartLineToolToolbarChangeLineStyleToSolid =
      'Chart.LineTool.Toolbar.ChangeLineStyleToSolid'),
    (t.ChartMarksToggleVisibility = 'Chart.Marks.ToggleVisibility'),
    (t.ChartMoveChartInLayout = 'Chart.MoveChartInLayout'),
    (t.ChartMoveChartInLayoutBack = 'Chart.MoveChartInLayout.Back'),
    (t.ChartMoveChartInLayoutForward = 'Chart.MoveChartInLayout.Forward'),
    (t.ChartTpoResetAllMergesAndSplits = 'Chart.TPO.ResetAllMergesAndSplits'),
    (t.ChartTpoSplitBlock = 'Chart.TPO.SplitBlock'),
    (t.ChartTpoMergeBlock = 'Chart.TPO.MergeBlock'),
    (t.ChartObjectTreeShow = 'Chart.ObjectTree.Show'),
    (t.ChartDataWindowShow = 'Chart.DataWindow.Show'),
    (t.ChartPaneControlsDeletePane = 'Chart.PaneControls.DeletePane'),
    (t.ChartPaneControlsMaximizePane = 'Chart.PaneControls.MaximizePane'),
    (t.ChartPaneControlsMinimizePane = 'Chart.PaneControls.MinimizePane'),
    (t.ChartPaneControlsMovePaneDown = 'Chart.PaneControls.MovePaneDown'),
    (t.ChartPaneControlsMovePaneUp = 'Chart.PaneControls.MovePaneUp'),
    (t.ChartPaneControlsCollapsePane = 'Chart.PaneControls.CollapsePane'),
    (t.ChartPaneControlsRestorePane = 'Chart.PaneControls.RestorePane'),
    (t.ChartPriceScaleLabels = 'Chart.PriceScale.Labels'),
    (t.ChartPriceScaleLabelsToggleBidAskLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleBidAskLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleHighLowPriceLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleHighLowPriceLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleAveragePriceLabelVisibility =
      'Chart.PriceScale.Labels.ToggleAveragePriceLabelVisibility'),
    (t.ChartPriceScaleLabelsToggleIndicatorsNameLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleIndicatorsNameLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleIndicatorsValueLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleIndicatorsValueLabelsVisibility'),
    (t.ChartPriceScaleLabelsTogglePrePostMarketLabelsVisibility =
      'Chart.PriceScale.Labels.TogglePrePostMarketLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleNoOverlappingLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleNoOverlappingLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleSeriesLastValueVisibility =
      'Chart.PriceScale.Labels.ToggleSeriesLastValueVisibility'),
    (t.ChartPriceScaleLabelsToggleSymbolNameLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleSymbolNameLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleSymbolPrevCloseValueVisibility =
      'Chart.PriceScale.Labels.ToggleSymbolPrevCloseValueVisibility'),
    (t.ChartPriceScaleMergeAllScales = 'Chart.PriceScale.MergeAllScales'),
    (t.ChartPriceScaleMergeAllScalesToLeft = 'Chart.PriceScale.MergeAllScalesToLeft'),
    (t.ChartPriceScaleMergeAllScalesToRight = 'Chart.PriceScale.MergeAllScalesToRight'),
    (t.ChartPriceScaleMoveToLeft = 'Chart.PriceScale.MoveToLeft'),
    (t.ChartPriceScaleMoveToRight = 'Chart.PriceScale.MoveToRight'),
    (t.ChartPriceScaleReset = 'Chart.PriceScale.Reset'),
    (t.ChartPriceScaleToggleAddOrderPlusButtonVisibility =
      'Chart.PriceScale.ToggleAddOrderPlusButtonVisibility'),
    (t.ChartPriceScaleToggleAutoScale = 'Chart.PriceScale.ToggleAutoScale'),
    (t.ChartPriceScaleToggleAutoScaleSeriesOnly = 'Chart.PriceScale.ToggleAutoScaleSeriesOnly'),
    (t.ChartPriceScaleToggleCountdownToBarCloseVisibility =
      'Chart.PriceScale.ToggleCountdownToBarCloseVisibility'),
    (t.ChartPriceScaleToggleIndexedTo100 = 'Chart.PriceScale.ToggleIndexedTo100'),
    (t.ChartPriceScaleToggleInvertScale = 'Chart.PriceScale.ToggleInvertScale'),
    (t.ChartPriceScaleToggleLogarithmic = 'Chart.PriceScale.ToggleLogarithmic'),
    (t.ChartPriceScaleTogglePercentage = 'Chart.PriceScale.TogglePercentage'),
    (t.ChartPriceScaleToggleRegular = 'Chart.PriceScale.ToggleRegular'),
    (t.ChartRedo = 'Chart.Redo'),
    (t.ChartRemoveAllIndicators = 'Chart.RemoveAllIndicators'),
    (t.ChartRemoveAllIndicatorsAndLineTools = 'Chart.RemoveAllIndicatorsAndLineTools'),
    (t.ChartRemoveAllLineTools = 'Chart.RemoveAllLineTools'),
    (t.ChartScalesReset = 'Chart.Scales.Reset'),
    (t.ChartScalesToggleLockPriceToBarRatio = 'Chart.Scales.ToggleLockPriceToBarRatio'),
    (t.ChartScrollToLineTool = 'Chart.ScrollToLineTool'),
    (t.ChartSelectedObjectHide = 'Chart.SelectedObject.Hide'),
    (t.ChartSelectedObjectRemove = 'Chart.SelectedObject.Remove'),
    (t.ChartSelectedObjectShow = 'Chart.SelectedObject.Show'),
    (t.ChartSelectedObjectShowSettingsDialog = 'Chart.SelectedObject.ShowSettingsDialog'),
    (t.ChartSelectedObjectToggleLocked = 'Chart.SelectedObject.ToggleLocked'),
    (t.ChartSeriesPriceScaleToggleAutoScale = 'Chart.Series.PriceScale.ToggleAutoScale'),
    (t.ChartSeriesPriceScaleToggleIndexedTo100 = 'Chart.Series.PriceScale.ToggleIndexedTo100'),
    (t.ChartSeriesPriceScaleToggleInvertPriceScale =
      'Chart.Series.PriceScale.ToggleInvertPriceScale'),
    (t.ChartSeriesPriceScaleToggleLogarithmic = 'Chart.Series.PriceScale.ToggleLogarithmic'),
    (t.ChartSeriesPriceScaleTogglePercentage = 'Chart.Series.PriceScale.TogglePercentage'),
    (t.ChartSeriesPriceScaleToggleRegular = 'Chart.Series.PriceScale.ToggleRegular'),
    (t.ChartSessionBreaksToggleVisibility = 'Chart.SessionBreaks.ToggleVisibility'),
    (t.ChartSetSession = 'Chart.SetSession'),
    (t.ChartSourceChangePriceScale = 'Chart.Source.ChangePriceScale'),
    (t.ChartSourceMergeDown = 'Chart.Source.MergeDown'),
    (t.ChartSourceMergeUp = 'Chart.Source.MergeUp'),
    (t.ChartSourceMoveToNoScale = 'Chart.Source.MoveToNoScale'),
    (t.ChartSourceMoveToOtherScale = 'Chart.Source.MoveToOtherScale'),
    (t.ChartSourceMoveToPane = 'Chart.Source.MoveToPane'),
    (t.ChartSourceUnmergeDown = 'Chart.Source.UnmergeDown'),
    (t.ChartSourceUnmergeUp = 'Chart.Source.UnmergeUp'),
    (t.ChartSourceVisualOrder = 'Chart.Source.VisualOrder'),
    (t.ChartSourceVisualOrderBringForward = 'Chart.Source.VisualOrder.BringForward'),
    (t.ChartSourceVisualOrderBringToFront = 'Chart.Source.VisualOrder.BringToFront'),
    (t.ChartSourceVisualOrderSendBackward = 'Chart.Source.VisualOrder.SendBackward'),
    (t.ChartSourceVisualOrderSendToBack = 'Chart.Source.VisualOrder.SendToBack'),
    (t.ChartSourceResetInputPoints = 'Chart.Source.ResetInputPoints'),
    (t.ChartThemeApply = 'Chart.Theme.Apply'),
    (t.ChartThemeApplyCustom = 'Chart.Theme.Apply.Custom'),
    (t.ChartThemeSaveAs = 'Chart.Theme.SaveAs'),
    (t.ChartTimeScaleReset = 'Chart.TimeScale.Reset'),
    (t.ChartUndo = 'Chart.Undo'),
    (t.ChartShowAllIdeas = 'Chart.ShowAllIdeas'),
    (t.ChartShowIdeasOfFollowedUsers = 'Chart.ShowIdeasOfFollowedUsers'),
    (t.ChartShowMyIdeasOnly = 'Chart.ShowMyIdeasOnly'),
    (t.ChartToggleVisibilityAllLineTools = 'Chart.ToggleVisibility.AllLineTools'),
    (t.ChartToggleVisibilityContinuousContractSwitch =
      'Chart.ToggleVisibility.ContinuousContractSwitch'),
    (t.ChartToggleVisibilityContractExpiration = 'Chart.ToggleVisibility.ContractExpiration'),
    (t.ChartToggleVisibilityDividends = 'Chart.ToggleVisibility.Dividends'),
    (t.ChartToggleVisibilityEarnings = 'Chart.ToggleVisibility.Earnings'),
    (t.ChartToggleVisibilityEconomicEvents = 'Chart.ToggleVisibility.EconomicEvents'),
    (t.ChartToggleVisibilitySplits = 'Chart.ToggleVisibility.Splits'),
    (t.ChartToggleVisibilityLatestNewsAndMinds = 'Chart.ToggleVisibility.LatestNewsAndMinds'),
    (t.ChartSourceIntervalsVisibility = 'Chart.Source.IntervalsVisibility'),
    (t.ChartSourceIntervalsVisibilityCurrentAndAbove =
      'Chart.Source.IntervalsVisibility.CurrentAndAbove'),
    (t.ChartSourceIntervalsVisibilityCurrentAndBelow =
      'Chart.Source.IntervalsVisibility.CurrentAndBelow'),
    (t.ChartSourceIntervalsVisibilityOnlyCurrent = 'Chart.Source.IntervalsVisibility.Current'),
    (t.ChartSourceIntervalsVisibilityAll = 'Chart.Source.IntervalsVisibility.All'),
    (t.NoteCreate = 'Note.Create'),
    (t.NoteEdit = 'Note.Edit'),
    (t.NoteRemove = 'Note.Remove'),
    (t.ObjectsTreeCreateGroup = 'ObjectsTree.CreateGroup'),
    (t.ObjectsTreeRemoveItem = 'ObjectsTree.RemoveItem'),
    (t.ObjectsTreeRenameItem = 'ObjectsTree.RenameItem'),
    (t.ObjectsTreeToggleItemLocked = 'ObjectsTree.ToggleItemLocked'),
    (t.ObjectsTreeToggleItemVisibility = 'ObjectsTree.ToggleItemVisibility'),
    (t.PineEditorConsoleCopyMessage = 'PineEditor.Console.CopyMessage'),
    (t.PineEditorConsoleToggleVisibility = 'PineEditor.Console.ToggleVisibility'),
    (t.PineEditorConsoleClear = 'PineEditor.Console.Clear'),
    (t.ScreenerAddSymbolToCompare = 'Screener.AddSymbolToCompare'),
    (t.ScreenerColumnRemove = 'Screener.Column.Remove'),
    (t.ScreenerFilterChange = 'Screener.Filter.Change'),
    (t.ScreenerFilterReset = 'Screener.Filter.Reset'),
    (t.ScreenerOpenSymbolChart = 'Screener.OpenSymbolChart'),
    (t.ScreenerOpenSymbolOverview = 'Screener.OpenSymbolOverview'),
    (t.ScreenerToggleVisibilityCurrency = 'Screener.ToggleVisibility.Currency'),
    (t.ScreenerToggleVisibilityDescription = 'Screener.ToggleVisibility.Description'),
    (t.ScreenerToggleVisibilityRating = 'Screener.ToggleVisibility.Rating'),
    (t.ScreenerToggleVisibilitySymbolType = 'Screener.ToggleVisibility.SymbolType'),
    (t.TradingCancelOrder = 'Trading.CancelOrder'),
    (t.TradingClosePosition = 'Trading.ClosePosition'),
    (t.TradingCustomActionId = 'Trading.CustomActionId'),
    (t.TradingDOMPlaceLimitOrder = 'Trading.DOMPlaceLimitOrder'),
    (t.TradingDOMPlaceMarketOrder = 'Trading.DOMPlaceMarketOrder'),
    (t.TradingDOMPlaceStopLimitOrder = 'Trading.DOMPlaceStopLimitOrder'),
    (t.TradingDOMPlaceStopOrder = 'Trading.DOMPlaceStopOrder'),
    (t.TradingEditOrder = 'Trading.EditOrder'),
    (t.TradingModifyPosition = 'Trading.ModifyPosition'),
    (t.TradingReversePosition = 'Trading.ReversePosition'),
    (t.TradingSellBuyButtonsToggleVisibility = 'Trading.SellBuyButtonsToggleVisibility'),
    (t.TradingTradeFromChart = 'Trading.TradeFromChart'),
    (t.TradingNoOverlapMode = 'Trading.NoOverlapMode'),
    (t.TradingShowSelectBrokerPanel = 'Trading.ShowSelectBrokerPanel'),
    (t.TradingOrderTitle = 'Trading.OrderTitle'),
    (t.TradingPositionTitle = 'Trading.PositionTitle'),
    (t.WatchlistActions = 'Watchlist.Actions'),
    (t.WatchlistAddSelectedSymbolsToCompare = 'Watchlist.AddSelectedSymbolsToCompare '),
    (t.WatchlistAddSymbolToCompare = 'Watchlist.AddSymbolToCompare'),
    (t.WatchlistAddSymbolToSection = 'Watchlist.AddSymbolToSection'),
    (t.WatchlistChangeFlaggedGroupColor = 'Watchlist.ChangeFlaggedGroupColor'),
    (t.WatchlistAddSymbol = 'Watchlist.AddSymbol'),
    (t.WatchlistCreate = 'Watchlist.Create'),
    (t.WatchlistAddSelectedSymbols = 'Watchlist.AddSelectedSymbols'),
    (t.WatchlistAddSelectedSymbolsLists = 'Watchlist.AddSelectedSymbols.Lists'),
    (t.WatchlistGetDisplayedTickerDescription = 'Watchlist.GetDisplayedTickerDescription'),
    (t.WatchlistCreateSection = 'Watchlist.CreateSection'),
    (t.WatchlistFlagSelectedSymbols = 'Watchlist.FlagSelectedSymbols'),
    (t.WatchlistFlagSymbol = 'Watchlist.FlagSymbol'),
    (t.WatchlistOpenSymbolChart = 'Watchlist.OpenSymbolChart'),
    (t.WatchlistOpenSymbolOverview = 'Watchlist.OpenSymbolOverview'),
    (t.WatchlistRemoveSection = 'Watchlist.RemoveSection'),
    (t.WatchlistRemoveSymbol = 'Watchlist.RemoveSymbol'),
    (t.WatchlistRenameSection = 'Watchlist.RenameSection'),
    (t.WatchlistUnflagAllSymbols = 'Watchlist.UnflagAllSymbols'),
    (t.WatchlistUnflagSelectedSymbols = 'Watchlist.UnflagSelectedSymbols'),
    (t.WatchlistUnflagSymbol = 'Watchlist.UnflagSymbol'),
    (function (e) {
      e.extractErrorReason = function (e) {
        return e.params[1];
      };
    })(i || (i = {})),
    (function (e) {
      (e.Default = 'default'), (e.FullSingleSession = 'full_single_session');
    })(o || (o = {})),
    ((r = e.TimeFrameType || (e.TimeFrameType = {})).PeriodBack = 'period-back'),
    (r.TimeRange = 'time-range'),
    (function (e) {
      (e.PeriodBack = 'period-back'), (e.TimeRange = 'time-range');
    })(n || (n = {})),
    ((a = e.MarketStatus || (e.MarketStatus = {})).Open = 'market'),
    (a.Pre = 'pre_market'),
    (a.Post = 'post_market'),
    (a.Close = 'out_of_session'),
    (a.Holiday = 'holiday'),
    ((s = e.MenuItemType || (e.MenuItemType = {})).Separator = 'separator'),
    (s.Action = 'action'),
    ((l = e.ClearMarksMode || (e.ClearMarksMode = {}))[(l.All = 0)] = 'All'),
    (l[(l.BarMarks = 1)] = 'BarMarks'),
    (l[(l.TimeScaleMarks = 2)] = 'TimeScaleMarks'),
    ((d = e.LineStudyPlotStyle || (e.LineStudyPlotStyle = {}))[(d.Line = 0)] = 'Line'),
    (d[(d.Histogram = 1)] = 'Histogram'),
    (d[(d.Cross = 3)] = 'Cross'),
    (d[(d.Area = 4)] = 'Area'),
    (d[(d.Columns = 5)] = 'Columns'),
    (d[(d.Circles = 6)] = 'Circles'),
    (d[(d.LineWithBreaks = 7)] = 'LineWithBreaks'),
    (d[(d.AreaWithBreaks = 8)] = 'AreaWithBreaks'),
    (d[(d.StepLine = 9)] = 'StepLine'),
    (d[(d.StepLineWithDiamonds = 10)] = 'StepLineWithDiamonds'),
    (d[(d.StepLineWithBreaks = 11)] = 'StepLineWithBreaks'),
    ((c = e.StudyPlotType || (e.StudyPlotType = {})).Line = 'line'),
    (c.Colorer = 'colorer'),
    (c.BarColorer = 'bar_colorer'),
    (c.BgColorer = 'bg_colorer'),
    (c.TextColorer = 'text_colorer'),
    (c.OhlcColorer = 'ohlc_colorer'),
    (c.CandleWickColorer = 'wick_colorer'),
    (c.CandleBorderColorer = 'border_colorer'),
    (c.UpColorer = 'up_colorer'),
    (c.DownColorer = 'down_colorer'),
    (c.Shapes = 'shapes'),
    (c.Chars = 'chars'),
    (c.Arrows = 'arrows'),
    (c.Data = 'data'),
    (c.DataOffset = 'dataoffset'),
    (c.OhlcOpen = 'ohlc_open'),
    (c.OhlcHigh = 'ohlc_high'),
    (c.OhlcLow = 'ohlc_low'),
    (c.OhlcClose = 'ohlc_close'),
    (function (e) {
      e.AlertCondition = 'alertcondition';
    })(h || (h = {})),
    ((g = e.StudyPlotDisplayTarget || (e.StudyPlotDisplayTarget = {}))[(g.None = 0)] = 'None'),
    (g[(g.Pane = 1)] = 'Pane'),
    (g[(g.DataWindow = 2)] = 'DataWindow'),
    (g[(g.PriceScale = 4)] = 'PriceScale'),
    (g[(g.StatusLine = 8)] = 'StatusLine'),
    (g[(g.All = 15)] = 'All'),
    (function (e) {
      (e[(e.None = 0)] = 'None'),
        (e[(e.Pane = 1)] = 'Pane'),
        (e[(e.DataWindow = 2)] = 'DataWindow'),
        (e[(e.PriceScale = 4)] = 'PriceScale'),
        (e[(e.StatusLine = 8)] = 'StatusLine'),
        (e[(e.All = 15)] = 'All');
    })(u || (u = {})),
    ((C = e.OhlcStudyPlotStyle || (e.OhlcStudyPlotStyle = {})).OhlcBars = 'ohlc_bars'),
    (C.OhlcCandles = 'ohlc_candles'),
    (function (e) {
      (e.Auto = 'auto'),
        (e.Tiny = 'tiny'),
        (e.Small = 'small'),
        (e.Normal = 'normal'),
        (e.Large = 'large'),
        (e.Huge = 'huge');
    })(S || (S = {})),
    ((p = e.StudyInputType || (e.StudyInputType = {})).Integer = 'integer'),
    (p.Float = 'float'),
    (p.Price = 'price'),
    (p.Bool = 'bool'),
    (p.Text = 'text'),
    (p.Symbol = 'symbol'),
    (p.Session = 'session'),
    (p.Source = 'source'),
    (p.Resolution = 'resolution'),
    (p.Time = 'time'),
    (p.BarTime = 'bar_time'),
    (p.Color = 'color'),
    (p.Textarea = 'text_area'),
    (function (e) {
      (e[(e.None = 0)] = 'None'),
        (e[(e.DataWindow = 2)] = 'DataWindow'),
        (e[(e.StatusLine = 8)] = 'StatusLine'),
        (e[(e.All = 15)] = 'All');
    })(m || (m = {})),
    (function (e) {
      (e.InitialCapital = 'initial_capital'),
        (e.Currency = 'currency'),
        (e.DefaultQTYValue = 'default_qty_value'),
        (e.DefaultQTYType = 'default_qty_type'),
        (e.Pyramiding = 'pyramiding'),
        (e.ComissionValue = 'commission_value'),
        (e.ComissionType = 'commission_type'),
        (e.BacktestFillLimitsAssumtion = 'backtest_fill_limits_assumption'),
        (e.Slippage = 'slippage'),
        (e.CalcOnOrderFills = 'calc_on_order_fills'),
        (e.CalcOnEveryTick = 'calc_on_every_tick'),
        (e.MarginLong = 'margin_long'),
        (e.MarginShort = 'margin_short'),
        (e.UseBarMagnifier = 'use_bar_magnifier'),
        (e.ProcessOrdersOnClose = 'process_orders_on_close'),
        (e.FillOrdersOnStandardOHLC = 'fill_orders_on_standard_ohlc');
    })(y || (y = {})),
    (function (e) {
      (e.Fixed = 'fixed'),
        (e.CashPerOrder = 'cash_per_order'),
        (e.PercentOfEquity = 'percent_of_equity');
    })(_ || (_ = {})),
    (function (e) {
      (e.Percent = 'percent'),
        (e.CashPerContract = 'cash_per_contract'),
        (e.CashPerOrder = 'cash_per_order');
    })(T || (T = {})),
    (function (e) {
      (e.FirstBar = 'first_visible_bar_time'),
        (e.LastBar = 'last_visible_bar_time'),
        (e.Realtime = 'subscribeRealtime');
    })(b || (b = {})),
    (function (e) {
      (e.FgColor = '__chart_fgcolor'), (e.BgColor = '__chart_bgcolor');
    })(P || (P = {})),
    ((L = e.StudyTargetPriceScale || (e.StudyTargetPriceScale = {}))[(L.Right = 0)] = 'Right'),
    (L[(L.Left = 1)] = 'Left'),
    (L[(L.NoScale = 2)] = 'NoScale'),
    (function (e) {
      (e[(e.Right = 0)] = 'Right'), (e[(e.Left = 1)] = 'Left'), (e[(e.None = 2)] = 'None');
    })(A || (A = {})),
    ((w = e.FilledAreaType || (e.FilledAreaType = {})).TypePlots = 'plot_plot'),
    (w.TypeHlines = 'hline_hline'),
    (function (e) {
      (e[(e.StopLoss = 0)] = 'StopLoss'),
        (e[(e.TrailingStop = 1)] = 'TrailingStop'),
        (e[(e.GuaranteedStop = 2)] = 'GuaranteedStop');
    })(f || (f = {})),
    (function (e) {
      e.Symbol = 'symbol';
    })(v || (v = {})),
    (function (e) {
      (e[(e.PopUp = 0)] = 'PopUp'), (e[(e.Notification = 1)] = 'Notification');
    })(I || (I = {})),
    (function (e) {
      (e[(e.CONNECTED = 1)] = 'CONNECTED'),
        (e[(e.CONNECTING = 2)] = 'CONNECTING'),
        (e[(e.DISCONNECTED = 3)] = 'DISCONNECTED'),
        (e[(e.ERROR = 4)] = 'ERROR');
    })(O || (O = {})),
    ((R = e.ConnectionStatus || (e.ConnectionStatus = {}))[(R.Connected = 1)] = 'Connected'),
    (R[(R.Connecting = 2)] = 'Connecting'),
    (R[(R.Disconnected = 3)] = 'Disconnected'),
    (R[(R.Error = 4)] = 'Error'),
    (function (e) {
      (e[(e.LIMIT = 1)] = 'LIMIT'),
        (e[(e.MARKET = 2)] = 'MARKET'),
        (e[(e.STOP = 3)] = 'STOP'),
        (e[(e.STOPLIMIT = 4)] = 'STOPLIMIT');
    })(D || (D = {})),
    ((V = e.OrderType || (e.OrderType = {}))[(V.Limit = 1)] = 'Limit'),
    (V[(V.Market = 2)] = 'Market'),
    (V[(V.Stop = 3)] = 'Stop'),
    (V[(V.StopLimit = 4)] = 'StopLimit'),
    (function (e) {
      (e[(e.BUY = 1)] = 'BUY'), (e[(e.SELL = -1)] = 'SELL');
    })(k || (k = {})),
    ((E = e.Side || (e.Side = {}))[(E.Buy = 1)] = 'Buy'),
    (E[(E.Sell = -1)] = 'Sell'),
    (function (e) {
      (e[(e.CANCELED = 1)] = 'CANCELED'),
        (e[(e.FILLED = 2)] = 'FILLED'),
        (e[(e.INACTIVE = 3)] = 'INACTIVE'),
        (e[(e.PLACING = 4)] = 'PLACING'),
        (e[(e.REJECTED = 5)] = 'REJECTED'),
        (e[(e.WORKING = 6)] = 'WORKING');
    })(F || (F = {})),
    (function (e) {
      (e[(e.ALL = 0)] = 'ALL'),
        (e[(e.CANCELED = 1)] = 'CANCELED'),
        (e[(e.FILLED = 2)] = 'FILLED'),
        (e[(e.INACTIVE = 3)] = 'INACTIVE'),
        (e[(e.REJECTED = 5)] = 'REJECTED'),
        (e[(e.WORKING = 6)] = 'WORKING');
    })(W || (W = {})),
    ((M = e.OrderStatus || (e.OrderStatus = {}))[(M.Canceled = 1)] = 'Canceled'),
    (M[(M.Filled = 2)] = 'Filled'),
    (M[(M.Inactive = 3)] = 'Inactive'),
    (M[(M.Placing = 4)] = 'Placing'),
    (M[(M.Rejected = 5)] = 'Rejected'),
    (M[(M.Working = 6)] = 'Working'),
    ((B = e.OrderStatusFilter || (e.OrderStatusFilter = {}))[(B.All = 0)] = 'All'),
    (B[(B.Canceled = 1)] = 'Canceled'),
    (B[(B.Filled = 2)] = 'Filled'),
    (B[(B.Inactive = 3)] = 'Inactive'),
    (B[(B.Rejected = 5)] = 'Rejected'),
    (B[(B.Working = 6)] = 'Working'),
    (function (e) {
      (e[(e.Order = 1)] = 'Order'), (e[(e.Position = 2)] = 'Position');
    })(N || (N = {})),
    (function (e) {
      (e[(e.ORDER = 1)] = 'ORDER'), (e[(e.POSITION = 2)] = 'POSITION');
    })(U || (U = {})),
    ((x = e.ParentType || (e.ParentType = {}))[(x.Order = 1)] = 'Order'),
    (x[(x.Position = 2)] = 'Position'),
    (x[(x.IndividualPosition = 3)] = 'IndividualPosition'),
    (function (e) {
      (e[(e.StopLoss = 0)] = 'StopLoss'),
        (e[(e.TakeProfit = 1)] = 'TakeProfit'),
        (e[(e.TrailingStop = 2)] = 'TrailingStop'),
        (e[(e.GuaranteedStop = 3)] = 'GuaranteedStop');
    })(H || (H = {})),
    (function (e) {
      (e[(e.LIMITPRICE = 1)] = 'LIMITPRICE'),
        (e[(e.STOPPRICE = 2)] = 'STOPPRICE'),
        (e[(e.TAKEPROFIT = 3)] = 'TAKEPROFIT'),
        (e[(e.STOPLOSS = 4)] = 'STOPLOSS');
    })(j || (j = {})),
    ((z = e.OrderTicketFocusControl || (e.OrderTicketFocusControl = {}))[(z.LimitPrice = 1)] =
      'LimitPrice'),
    (z[(z.StopPrice = 2)] = 'StopPrice'),
    (z[(z.TakeProfit = 3)] = 'TakeProfit'),
    (z[(z.StopLoss = 4)] = 'StopLoss'),
    (z[(z.Quantity = 5)] = 'Quantity'),
    (function (e) {
      (e[(e.ERROR = 0)] = 'ERROR'), (e[(e.SUCCESS = 1)] = 'SUCCESS');
    })(G || (G = {})),
    (($ = e.NotificationType || (e.NotificationType = {}))[($.Error = 0)] = 'Error'),
    ($[($.Success = 1)] = 'Success'),
    (function (e) {
      (e[(e.Demo = 1)] = 'Demo'), (e[(e.Real = 0)] = 'Real');
    })(J || (J = {})),
    ((q = e.OrderOrPositionMessageType || (e.OrderOrPositionMessageType = {})).Information =
      'information'),
    (q.Warning = 'warning'),
    (q.Error = 'error'),
    (function (e) {
      (e.Demo = 'demo'), (e.Live = 'live');
    })(K || (K = {})),
    (function (e) {
      (e[(e.LogOut = 0)] = 'LogOut'),
        (e[(e.FailedRestoring = 1)] = 'FailedRestoring'),
        (e[(e.Offline = 2)] = 'Offline'),
        (e[(e.APIError = 3)] = 'APIError'),
        (e[(e.TwoFactorRequired = 4)] = 'TwoFactorRequired'),
        (e[(e.CancelAuthorization = 5)] = 'CancelAuthorization'),
        (e[(e.TimeOutForAuthorization = 6)] = 'TimeOutForAuthorization'),
        (e[(e.OauthError = 7)] = 'OauthError'),
        (e[(e.BrokenConnection = 8)] = 'BrokenConnection'),
        (e[(e.FailedSignIn = 9)] = 'FailedSignIn');
    })(Z || (Z = {})),
    (function (e) {
      (e[(e.None = 0)] = 'None'), (e[(e.Pips = 1)] = 'Pips'), (e[(e.Ticks = 2)] = 'Ticks');
    })(Q || (Q = {})),
    (function (e) {
      (e.Halted = 'HALTED'),
        (e.NotShortable = 'NOT-SHORTABLE'),
        (e.HardToBorrow = 'HARD-TO-BORROW');
    })(Y || (Y = {})),
    (function (e) {
      (e[(e.Limit = 1)] = 'Limit'), (e[(e.Stop = 2)] = 'Stop');
    })(X || (X = {})),
    (function (e) {
      (e.Disallowed = 'disallowed'),
        (e.Allowed = 'allowed'),
        (e.AllowedWithWarning = 'allowed_with_warning');
    })(ee || (ee = {})),
    (function (e) {
      (e.PlaceOrder = 'place_order'),
        (e.ModifyOrder = 'modify_order'),
        (e.CancelOrder = 'cancel_order'),
        (e.ModifyPosition = 'modify_position'),
        (e.ClosePosition = 'close_position'),
        (e.ModifyIndividualPosition = 'modify_individual_position'),
        (e.CloseIndividualPosition = 'close_individual_position'),
        (e.CloseNetPosition = 'close_net_position');
    })(te || (te = {})),
    ((ie = e.StandardFormatterName || (e.StandardFormatterName = {})).Date = 'date'),
    (ie.DateOrDateTime = 'dateOrDateTime'),
    (ie.Default = 'default'),
    (ie.Fixed = 'fixed'),
    (ie.FixedInCurrency = 'fixedInCurrency'),
    (ie.VariablePrecision = 'variablePrecision'),
    (ie.FormatQuantity = 'formatQuantity'),
    (ie.FormatPrice = 'formatPrice'),
    (ie.FormatPriceForexSup = 'formatPriceForexSup'),
    (ie.FormatPriceInCurrency = 'formatPriceInCurrency'),
    (ie.IntegerSeparated = 'integerSeparated'),
    (ie.LocalDate = 'localDate'),
    (ie.LocalDateOrDateTime = 'localDateOrDateTime'),
    (ie.Percentage = 'percentage'),
    (ie.Pips = 'pips'),
    (ie.Profit = 'profit'),
    (ie.ProfitInInstrumentCurrency = 'profitInInstrumentCurrency'),
    (ie.Side = 'side'),
    (ie.PositionSide = 'positionSide'),
    (ie.Status = 'status'),
    (ie.Symbol = 'symbol'),
    (ie.Text = 'text'),
    (ie.Type = 'type'),
    (ie.MarginPercent = 'marginPercent'),
    (ie.Empty = 'empty'),
    ((oe = e.OverridePriceAxisLastValueMode || (e.OverridePriceAxisLastValueMode = {}))[
      (oe.LastPriceAndPercentageValue = 0)
    ] = 'LastPriceAndPercentageValue'),
    (oe[(oe.LastValueAccordingToScale = 1)] = 'LastValueAccordingToScale'),
    ((re = e.OverrideLineStyle || (e.OverrideLineStyle = {}))[(re.Solid = 0)] = 'Solid'),
    (re[(re.Dotted = 1)] = 'Dotted'),
    (re[(re.Dashed = 2)] = 'Dashed'),
    (function (e) {
      (e[(e.Offline = 0)] = 'Offline'),
        (e[(e.Resolving = 1)] = 'Resolving'),
        (e[(e.Loading = 2)] = 'Loading'),
        (e[(e.Ready = 3)] = 'Ready'),
        (e[(e.InvalidSymbol = 4)] = 'InvalidSymbol'),
        (e[(e.Snapshot = 5)] = 'Snapshot'),
        (e[(e.EOD = 6)] = 'EOD'),
        (e[(e.Pulse = 7)] = 'Pulse'),
        (e[(e.Delayed = 8)] = 'Delayed'),
        (e[(e.DelayedSteaming = 9)] = 'DelayedSteaming'),
        (e[(e.NoBars = 10)] = 'NoBars'),
        (e[(e.Replay = 11)] = 'Replay'),
        (e[(e.Error = 12)] = 'Error'),
        (e[(e.CalculationError = 13)] = 'CalculationError'),
        (e[(e.UnsupportedResolution = 14)] = 'UnsupportedResolution');
    })(ne || (ne = {})),
    (function (e) {
      (e[(e.Markers = 0)] = 'Markers'),
        (e[(e.Stepline = 1)] = 'Stepline'),
        (e[(e.Simple = 2)] = 'Simple');
    })(ae || (ae = {})),
    ((se = e.ChartStyle || (e.ChartStyle = {}))[(se.Bar = 0)] = 'Bar'),
    (se[(se.Candle = 1)] = 'Candle'),
    (se[(se.Line = 2)] = 'Line'),
    (se[(se.Area = 3)] = 'Area'),
    (se[(se.Renko = 4)] = 'Renko'),
    (se[(se.Kagi = 5)] = 'Kagi'),
    (se[(se.PnF = 6)] = 'PnF'),
    (se[(se.LineBreak = 7)] = 'LineBreak'),
    (se[(se.HeikinAshi = 8)] = 'HeikinAshi'),
    (se[(se.HollowCandle = 9)] = 'HollowCandle'),
    (se[(se.Baseline = 10)] = 'Baseline'),
    (se[(se.Range = 11)] = 'Range'),
    (se[(se.HiLo = 12)] = 'HiLo'),
    (se[(se.Column = 13)] = 'Column'),
    (se[(se.LineWithMarkers = 14)] = 'LineWithMarkers'),
    (se[(se.Stepline = 15)] = 'Stepline'),
    (se[(se.HLCArea = 16)] = 'HLCArea'),
    (se[(se.VolFootprint = 17)] = 'VolFootprint'),
    (se[(se.TPO = 18)] = 'TPO'),
    (se[(se.VolCandle = 19)] = 'VolCandle'),
    (se[(se.SVP = 20)] = 'SVP'),
    ((le = e.TimeHoursFormat || (e.TimeHoursFormat = {})).TwentyFourHours = '24-hours'),
    (le.TwelveHours = '12-hours'),
    (function (e) {
      (e[(e.Initial = 2)] = 'Initial'),
        (e[(e.SeriesZOrderIsAlwaysZero = 3)] = 'SeriesZOrderIsAlwaysZero'),
        (e[(e.Current = 3)] = 'Current');
    })(de || (de = {})),
    ((ce = e.PlDisplay || (e.PlDisplay = {}))[(ce.Money = 0)] = 'Money'),
    (ce[(ce.Pips = 1)] = 'Pips'),
    (ce[(ce.Percentage = 2)] = 'Percentage'),
    ((he = e.TradedGroupHorizontalAlignment || (e.TradedGroupHorizontalAlignment = {}))[
      (he.Left = 0)
    ] = 'Left'),
    (he[(he.Center = 1)] = 'Center'),
    (he[(he.Right = 2)] = 'Right');
  e.PlDisplay.Money, e.PlDisplay.Money, e.TradedGroupHorizontalAlignment.Right;
  let ge;
  let ue;
  let Ce;
  let Se;
  let pe;
  let me;
  let ye;
  let _e;
  let Te;
  let be;
  let Pe;
  let Le;
  let Ae;
  let we;
  let fe;
  function ve(e, t) {
    const i = { ...e };
    for (const o in t)
      typeof e[o] !== 'object' || e[o] === null || Array.isArray(e[o]) ?
        void 0 !== t[o] && (i[o] = t[o])
      : (i[o] = ve(e[o], t[o]));
    return i;
  }
  !(function (e) {
    (e[(e.Background = 0)] = 'Background'),
      (e[(e.Foreground = 1)] = 'Foreground'),
      (e[(e.Topmost = 2)] = 'Topmost');
  })(ge || (ge = {})),
    (function (e) {
      (e[(e.Unavailable = 0)] = 'Unavailable'),
        (e[(e.AvailableReadonlyAlwaysDisabled = 1)] = 'AvailableReadonlyAlwaysDisabled'),
        (e[(e.AvailableReadonlyAlwaysEnabled = 2)] = 'AvailableReadonlyAlwaysEnabled'),
        (e[(e.Available = 3)] = 'Available');
    })(ue || (ue = {})),
    (function (e) {
      (e[(e.ViewportChangeUserAction = 0)] = 'ViewportChangeUserAction'),
        (e[(e.DataUpdate = 1)] = 'DataUpdate'),
        (e[(e.SeriesRestart = 2)] = 'SeriesRestart'),
        (e[(e.SeriesCompleted = 3)] = 'SeriesCompleted'),
        (e[(e.StudyCreation = 4)] = 'StudyCreation');
    })(Ce || (Ce = {})),
    (function (e) {
      e[(e.Chart = 0)] = 'Chart';
    })(Se || (Se = {})),
    ((pe = e.VisibilityType || (e.VisibilityType = {})).AlwaysOn = 'alwaysOn'),
    (pe.VisibleOnMouseOver = 'visibleOnMouseOver'),
    (pe.AlwaysOff = 'alwaysOff'),
    ((me = e.PriceScaleMode || (e.PriceScaleMode = {}))[(me.Normal = 0)] = 'Normal'),
    (me[(me.Log = 1)] = 'Log'),
    (me[(me.Percentage = 2)] = 'Percentage'),
    (me[(me.IndexedTo100 = 3)] = 'IndexedTo100'),
    ((ye = e.SeriesType || (e.SeriesType = {}))[(ye.Bars = 0)] = 'Bars'),
    (ye[(ye.Candles = 1)] = 'Candles'),
    (ye[(ye.Line = 2)] = 'Line'),
    (ye[(ye.Area = 3)] = 'Area'),
    (ye[(ye.HeikenAshi = 8)] = 'HeikenAshi'),
    (ye[(ye.HollowCandles = 9)] = 'HollowCandles'),
    (ye[(ye.Baseline = 10)] = 'Baseline'),
    (ye[(ye.HiLo = 12)] = 'HiLo'),
    (ye[(ye.Column = 13)] = 'Column'),
    (ye[(ye.LineWithMarkers = 14)] = 'LineWithMarkers'),
    (ye[(ye.Stepline = 15)] = 'Stepline'),
    (ye[(ye.HLCArea = 16)] = 'HLCArea'),
    (ye[(ye.VolCandle = 19)] = 'VolCandle'),
    (ye[(ye.Renko = 4)] = 'Renko'),
    (ye[(ye.Kagi = 5)] = 'Kagi'),
    (ye[(ye.PointAndFigure = 6)] = 'PointAndFigure'),
    (ye[(ye.LineBreak = 7)] = 'LineBreak'),
    (function (e) {
      e.Value = '_seriesId';
    })(_e || (_e = {})),
    ((Te = e.HHistDirection || (e.HHistDirection = {})).LeftToRight = 'left_to_right'),
    (Te.RightToLeft = 'right_to_left'),
    (function (e) {
      (e.Relative = 'relative'), (e.Absolute = 'absolute');
    })(be || (be = {})),
    (function (e) {
      (e.UpDown = 'Up/Down'), (e.Total = 'Total'), (e.Delta = 'Delta');
    })(Pe || (Pe = {})),
    ((Le = e.MarkLocation || (e.MarkLocation = {})).AboveBar = 'AboveBar'),
    (Le.BelowBar = 'BelowBar'),
    (Le.Top = 'Top'),
    (Le.Bottom = 'Bottom'),
    (Le.Right = 'Right'),
    (Le.Left = 'Left'),
    (Le.Absolute = 'Absolute'),
    (Le.AbsoluteUp = 'AbsoluteUp'),
    (Le.AbsoluteDown = 'AbsoluteDown'),
    (function (e) {
      (e.Left = 'left'), (e.Center = 'center'), (e.Right = 'right');
    })(Ae || (Ae = {})),
    (function (e) {
      (e.Top = 'top'), (e.Middle = 'middle'), (e.Bottom = 'bottom');
    })(we || (we = {})),
    ((fe = e.LineStyle || (e.LineStyle = {}))[(fe.Solid = 0)] = 'Solid'),
    (fe[(fe.Dotted = 1)] = 'Dotted'),
    (fe[(fe.Dashed = 2)] = 'Dashed');
  const Ie = {
    autosize: !1,
    brokerConfig: { configFlags: {} },
    charts_storage_api_version: '1.0',
    client_id: '0',
    container: '',
    debug: !1,
    disabled_features: [],
    enabled_features: [],
    favorites: { chartTypes: [], drawingTools: [], indicators: [], intervals: [] },
    fullscreen: !1,
    height: 500,
    interval: '1D',
    library_path: '',
    locale: 'en',
    logo: {},
    overrides: { 'mainSeriesProperties.showCountdown': !1 },
    studies_overrides: {},
    time_frames: [
      { resolution: '1W', text: '5y' },
      { resolution: '1W', text: '1y' },
      { resolution: '120', text: '6m' },
      { resolution: '60', text: '3m' },
      { resolution: '30', text: '1m' },
      { resolution: '5', text: '5d' },
      { resolution: '1', text: '1d' },
    ],
    timezone: 'Etc/UTC',
    trading_customization: { order: {}, position: {} },
    user_id: '0',
    widgetbar: {
      datawindow: !1,
      details: !1,
      news: !1,
      watchlist: !1,
      watchlist_settings: { default_symbols: [] },
    },
    width: 800,
  };
  const Oe = JSON.parse(
    '[{"iso":"ar","dir":"rtl","language":"ar"},{"iso":"pt","dir":"ltr","language":"pt"},{"iso":"ca","dir":"ltr","language":"ca_ES"},{"iso":"cs","dir":"ltr","language":"cs"},{"iso":"de","dir":"ltr","language":"de"},{"iso":"en","dir":"ltr","language":"en"},{"iso":"es","dir":"ltr","language":"es"},{"iso":"fa","dir":"rtl","language":"fa"},{"iso":"fr","dir":"ltr","language":"fr"},{"iso":"he","dir":"rtl","language":"he_IL"},{"iso":"hu","dir":"ltr","language":"hu_HU"},{"iso":"id","dir":"ltr","language":"id_ID"},{"iso":"en","dir":"ltr","language":"en"},{"iso":"it","dir":"ltr","language":"it"},{"iso":"ja","dir":"ltr","language":"ja"},{"iso":"ko","dir":"ltr","language":"ko"},{"iso":"ms","dir":"ltr","language":"ms_MY"},{"iso":"pl","dir":"ltr","language":"pl"},{"iso":"ru","dir":"ltr","language":"ru"},{"iso":"sv","dir":"ltr","language":"sv"},{"iso":"th","dir":"ltr","language":"th"},{"iso":"tr","dir":"ltr","language":"tr"},{"iso":"vi","dir":"ltr","language":"vi"},{"iso":"zh-Hans","dir":"ltr","language":"zh"},{"iso":"zh-Hant","dir":"ltr","language":"zh_TW"},{"iso":"el","dir":"ltr","language":"el"},{"iso":"nl","dir":"ltr","language":"nl_NL"},{"iso":"ro","dir":"ltr","language":"ro"}]'
  );
  let Re = !1;
  function De() {
    return 'CL v28.2.0 (internal id d99cb263 @ 2024-10-02T08:48:25.942Z)';
  }
  const Ve = class {
    constructor(e) {
      let t;
      let i;
      if (
        ((this._id = `tradingview_${((1048576 * (1 + Math.random())) | 0).toString(16).substring(1)}`),
        (this._ready = !1),
        (this._readyHandlers = []),
        (this._onWindowResize = this._autoResizeChart.bind(this)),
        !e.datafeed)
      )
        throw new Error('Datafeed is not defined');
      ((t = e.overrides) === null || void 0 === t ?
        void 0
      : t['mainSeriesProperties.priceAxisProperties.lockScale']) &&
        (console.warn(
          'mainSeriesProperties.priceAxisProperties.lockScale can not be set to true within the widget constructor'
        ),
        delete e.overrides['mainSeriesProperties.priceAxisProperties.lockScale']),
        (this._options = ve(Ie, e));
      ((i = this._options.theme) !== null && void 0 !== i ? i : 'light').toLowerCase() === 'dark' &&
        void 0 === this._options.loading_screen &&
        (this._options.loading_screen = { backgroundColor: '#131722' }),
        (this._options.debug || this._options.debug_broker) &&
          (Re ||
            ((Re = !0),
            console.log('Using CL v28.2.0 (internal id d99cb263 @ 2024-10-02T08:48:25.942Z)'))),
        this._create();
    }

    _autoResizeChart() {
      this._options.fullscreen &&
        ((this._iFrame.style.height = `${window.innerHeight}px`),
        ke &&
          setTimeout(() => {
            this._iFrame.style.height = `${window.innerHeight}px`;
          }, 30));
    }

    async _create() {
      let e;
      let t;
      let i;
      let o;
      const r =
        (t =
          (e = this._options.enabled_features) === null || void 0 === e ?
            void 0
          : e.includes('iframe_loading_same_origin')) !== null &&
        void 0 !== t &&
        t;
      const n =
        r ||
        ((o =
          (i = this._options.enabled_features) === null || void 0 === i ?
            void 0
          : i.includes('iframe_loading_compatibility_mode')) !== null &&
          void 0 !== o &&
          o);
      const [a, s] = this._render(!n, r);
      const l = this._options.container;
      const d = typeof l === 'string' ? document.getElementById(l) : l;
      if (d === null) throw new Error(`There is no such element - #${this._options.container}`);
      (d.innerHTML = a), (this._iFrame = d.querySelector(`#${this._id}`));
      const c = this._iFrame;
      r && (await this._innerWindowEvent('sameOriginLoad')),
        n &&
          (c.contentWindow ?
            (c.contentWindow.document.open(),
            c.contentWindow.document.write(s),
            c.contentWindow.document.close())
          : console.warn(
              'Unable to locate contentWindow for the created iframe. Please try disabling the `iframe_loading_compatibility_mode` featureset.'
            )),
        (this._innerWindowLoaded = this._innerWindowEvent('innerWindowLoad')),
        (this._options.autosize || this._options.fullscreen) &&
          ((c.style.width = '100%'), this._options.fullscreen || (c.style.height = '100%')),
        window.addEventListener('resize', this._onWindowResize),
        this._onWindowResize(),
        this._innerWindowLoaded.then(() => {
          try {
            this._innerWindow().widgetReady(() => {
              this._ready = !0;
              for (const e of this._readyHandlers)
                try {
                  e.call(this);
                } catch (e) {
                  console.error(e);
                }
              this._innerWindow().initializationFinished();
            });
          } catch (e) {
            if (e instanceof Error && /widgetReady is not a function/.test(e.message))
              throw new Error(
                `There was an error when loading the library. Usually this error means the library failed to load its static files. Check that the library files are available at ${window.location.host}/${this._options.library_path || ''} or correct the library_path option.`
              );
          }
        });
    }

    _doWhenInnerApiLoaded(e) {
      this._doWhenInnerWindowLoaded((t) => {
        t.doWhenApiIsReady(() => e(this._innerAPI()));
      });
    }

    _doWhenInnerWindowLoaded(e) {
      this._ready ?
        e(this._innerWindow())
      : this._innerWindowLoaded.then(() => {
          e(this._innerWindow());
        });
    }

    _innerAPI() {
      return this._innerWindow().tradingViewApi;
    }

    _innerWindow() {
      return this._iFrame.contentWindow;
    }

    _innerWindowEvent(e) {
      return new Promise((t) => {
        const i = () => {
          this._innerWindow().removeEventListener(e, i), t();
        };
        this._innerWindow().addEventListener(e, i);
      });
    }

    _render(e, t) {
      let i;
      const o = window;
      if (
        ((o[this._id] = {
          additionalSymbolInfoFields: this._options.additional_symbol_info_fields,
          brokerConfig: this._options.broker_config || this._options.brokerConfig,
          brokerFactory: this._options.broker_factory,
          contextMenu: this._options.context_menu,
          customChartDescriptionFunction: this._options.custom_chart_description_function,
          customFormatters: this._options.custom_formatters,
          customThemes: this._options.custom_themes,
          customTimezones: this._options.custom_timezones,
          customTranslateFunction: this._options.custom_translate_function,
          datafeed: this._options.datafeed,
          disabledFeatures: this._options.disabled_features,
          enabledFeatures: this._options.enabled_features,
          favorites: this._options.favorites,
          getCustomIndicators: this._options.custom_indicators_getter,
          headerWidgetButtonsMode: this._options.header_widget_buttons_mode,
          loading_screen: this._options.loading_screen,
          loadLastChart: this._options.load_last_chart,
          logo: this._options.logo,
          newsProvider: this._options.news_provider,
          numeric_formatting: this._options.numeric_formatting,
          overrides: this._options.overrides,
          restConfig: this._options.restConfig,
          rss_news_feed: this._options.rss_news_feed,
          rss_news_title: this._options.rss_news_title,
          saveLoadAdapter: this._options.save_load_adapter,
          settingsAdapter: this._options.settings_adapter,
          settingsOverrides: this._options.settings_overrides,
          studiesOverrides: this._options.studies_overrides,
          symbolSearchComplete: this._options.symbol_search_complete,
          timeframe: this._options.timeframe,
          tradingCustomization: this._options.trading_customization,
        }),
        this._options.saved_data)
      )
        (o[this._id].chartContent = { json: this._options.saved_data }),
          this._options.saved_data_meta_info &&
            (o[this._id].chartContentExtendedData = this._options.saved_data_meta_info);
      else if (!this._options.load_last_chart && !this._options.symbol)
        throw new Error(
          "Symbol is not defined: either 'symbol' or 'load_last_chart' option must be set"
        );
      if (
        (this._options.library_path &&
          !this._options.library_path.endsWith('/') &&
          console.warn('library_path option should contain a trailing forward slash'),
        this._options.locale)
      ) {
        const e = encodeURIComponent(this._options.locale);
        Oe.findIndex((t) => t.language === e) >= 0 ||
          (console.warn("locale isn't supported. Using default of `en`."),
          (this._options.locale = 'en'));
      }
      const r = (function (e, t) {
        let i;
        const o = new URL(`${e || ''}`, location.href).href;
        const r = JSON.parse(
          '["bundles/runtime.7dd2b495dd46fa7aaf80.js","bundles/__LANG__.4026.45ee1092b1b9fbf8f257.js","bundles/9662.03109f673cda5962c847.css","bundles/7346.b02c4b5d2d08b5be4162.js","bundles/library.34b18c357d450582c1a4.js"]'
        );
        const n = encodeURIComponent(t);
        const a =
          (i = Oe.find((e) => e.language === n)) !== null && void 0 !== i ?
            i
          : { dir: 'ltr', iso: 'en' };
        const s = `lang="${a.iso}" dir="${a.dir}"`;
        const l = `\n${(function (e, t, i) {
          if (void 0 === e) return '';
          const o = [];
          const r = [];
          for (const n of e)
            n.endsWith('.js') ?
              o.push(
                `<script defer crossorigin="anonymous" src="${n.replace('__LANG__', i)}"><\/script>`
              )
            : n.endsWith('.css') &&
              r.push(
                `<link type="text/css" href="${t ? n.replace(/\.css$/i, '.rtl.css') : n}" rel="stylesheet"/>`
              );
          return [...o, ...r].join('\n');
        })(r, a.dir === 'rtl', n)}\n`;
        return `<!DOCTYPE html><html ${(d = { bundles: l, htmlAttrs: s, libraryPath: o, localeLanguage: n }).htmlAttrs}><head><base href="${d.libraryPath}"><meta charset="utf-8"><script>window===window.parent&&(location.href="about:blank")<\/script> ${d.bundles} </head><body class="chart-page unselectable on-widget"><div class="loading-indicator" id="loading-indicator"></div><script>var JSServer={},__initialEnabledFeaturesets=["charting_library"]<\/script><script>(function() {\n\t\twindow.urlParams = (function () {\n\t\t\tvar match,\n\t\t\t\tpl\t = /\\+/g,  // Regex for replacing addition symbol with a space\n\t\t\t\tsearch = /([^&=]+)=?([^&]*)/g,\n\t\t\t\tdecode = function (s) { return decodeURIComponent(s.replace(pl, ' ')).replace(/<\\/?[^>]+(>|$)/g, ''); },\n\t\t\t\tquery = function() {\n\t\t\t\t\t// We don't use hash on the url because: safari 13 throws an error if you attempt this\n\t\t\t\t\t// on a blob, and safari 14 will strip hash from blob urls.\n\t\t\t\t\tif (frameElement && frameElement.dataset.widgetOptions) {\n\t\t\t\t\t\treturn frameElement.dataset.widgetOptions;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthrow "Unexpected use of this page";\n\t\t\t\t\t}\n\t\t\t\t}(),\n\t\t\t\tresult = {};\n\n\t\t\twhile (match = search.exec(query)) {\n\t\t\t\tresult[decode(match[1])] = decode(match[2]);\n\t\t\t}\n\n\t\t\tvar additionalSettingsObject = window.parent[result.uid];\n\n\t\t\tvar customObjectNames = ['datafeed', 'customFormatters', 'brokerFactory', 'save_load_adapter', 'customTranslateFunction', 'contextMenu'];\n\n\t\t\tfor (var p in additionalSettingsObject) {\n\t\t\t\tif (customObjectNames.indexOf(p) === -1) {\n\t\t\t\t\tresult[p] = JSON.stringify(additionalSettingsObject[p]);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn result;\n\t\t})();\n\n\t\twindow.locale = urlParams.locale;\n\t\twindow.language = urlParams.locale; // a very big attention needed here\n\t\twindow.customTranslateFunction = window.parent[urlParams.uid].customTranslateFunction;\n\t\twindow.customChartDescriptionFunction = window.parent[urlParams.uid].customChartDescriptionFunction;\n\n\t\twindow.addCustomCSSFile = function(href) {\n\t\t\tvar link = document.createElement('link');\n\t\t\tlink.setAttribute('type', 'text/css');\n\t\t\tlink.setAttribute('rel', 'stylesheet');\n\t\t\tlink.setAttribute('href', href);\n\t\t\tlink.setAttribute('cross-origin', 'anonymous');\n\n\t\t\twindow.loadedCustomCss = new Promise((resolve) => {\n\t\t\t\tlink.onload = resolve;\n\t\t\t\tlink.onerror = resolve;\n\t\t\t});\n\t\t\tdocument.body.appendChild(link);\n\t\t};\n\n\t\twindow.loadedCustomCss = Promise.resolve();\n\t\tif (!!urlParams.customCSS) {\n\t\t\twindow.addCustomCSSFile(urlParams.customCSS);\n\t\t}\n\n\t\tvar loadingScreenParams = {};\n\n\t\tif (typeof urlParams.loading_screen === 'string') {\n\t\t\ttry {\n\t\t\t\tloadingScreenParams = JSON.parse(urlParams.loading_screen);\n\t\t\t} catch(e) {}\n\t\t}\n\n\t\tvar loadingIndicatorElement = document.getElementById('loading-indicator');\n\n\t\tif (loadingScreenParams.backgroundColor) {\n\t\t\tloadingIndicatorElement.style = 'background-color: ' + loadingScreenParams.backgroundColor;\n\t\t}\n\n\t\t!function(){"use strict";var t,e=new WeakMap;!function(t){t[t.Element=1]="Element",t[t.Document=9]="Document"}(t||(t={}));var n={mini:"xsmall",xxsmall:"xxsmall",xsmall:"xsmall",small:"small",medium:"medium",large:"large"};var s,i,o,r,l,c=(void 0===l&&(l=""),s='<div class="tv-spinner '.concat(l,'" role="progressbar"></div>'),o=function(n,s){var i,o;return i=null==s?document.documentElement:s.nodeType===t.Document?s.documentElement:s,e&&(o=e.get(i)),o||((o=i.ownerDocument.createRange()).selectNodeContents(i),e&&e.set(i,o)),o.createContextualFragment(n)}(s,i),null!==(r=o.firstElementChild)&&o.removeChild(r),r),a=function(){function t(t){this._shown=!1,this._el=c.cloneNode(!0),this.setSize(n[t||"large"])}return t.prototype.spin=function(t){return this._el.classList.add("tv-spinner--shown"),void 0===this._container&&(this._container=t,void 0!==t&&t.appendChild(this._el)),this._shown=!0,this},t.prototype.stop=function(t){return t&&void 0!==this._container&&this._container.removeChild(this._el),this._el&&this._el.classList.remove("tv-spinner--shown"),this._shown=!1,this},t.prototype.setStyle=function(t){var e=this;return Object.keys(t).forEach((function(n){var s=t[n];void 0!==s&&e._el.style.setProperty(n,s)})),this},t.prototype.style=function(){return this._el.style},t.prototype.setSize=function(t){var e=void 0!==t?"tv-spinner--size_".concat(t):"";return this._el.className="tv-spinner ".concat(e," ").concat(this._shown?"tv-spinner--shown":""),this},t.prototype.getEl=function(){return this._el},t.prototype.destroy=function(){this.stop(),delete this._el,delete this._container},t}();window.Spinner=a}();\n\n\n\t\tvar spinnerColor = (loadingScreenParams.foregroundColor) ? loadingScreenParams.foregroundColor : undefined;\n\n\t\tvar loadingSpinner = new Spinner('large').setStyle({\n\t\t\t'--tv-spinner-color': spinnerColor,\n\t\t\tzIndex: String(2e9),\n\t\t});\n\t\tloadingSpinner.getEl().classList.add('spinner');\n\t\tloadingSpinner.spin(loadingIndicatorElement);\n\t})();<\/script></body></html>`;
        let d;
      })(this._options.library_path || '', this._options.locale);
      let n = new URL('about:blank');
      if (e) {
        const e = new Blob([r], { type: 'text/html' });
        const t = URL.createObjectURL(e);
        n = new URL(t);
      } else if (t) {
        const e = (i = this._options.library_path) !== null && void 0 !== i ? i : '/';
        n = new URL(`${e}sameorigin.html`, location.origin);
      }
      const a = `symbol=${encodeURIComponent(this._options.symbol || '')}&interval=${encodeURIComponent(this._options.interval)}${this._options.toolbar_bg ? `&toolbarbg=${encodeURIComponent(this._options.toolbar_bg.replace('#', ''))}` : ''}${this._options.studies_access ? `&studiesAccess=${encodeURIComponent(JSON.stringify(this._options.studies_access))}` : ''}&widgetbar=${encodeURIComponent(JSON.stringify(this._options.widgetbar))}${this._options.drawings_access ? `&drawingsAccess=${encodeURIComponent(JSON.stringify(this._options.drawings_access))}` : ''}&timeFrames=${encodeURIComponent(JSON.stringify(this._options.time_frames))}&locale=${encodeURIComponent(this._options.locale)}&uid=${encodeURIComponent(this._id)}&clientId=${encodeURIComponent(String(this._options.client_id))}&userId=${encodeURIComponent(String(this._options.user_id))}${this._options.charts_storage_url ? `&chartsStorageUrl=${encodeURIComponent(this._options.charts_storage_url)}` : ''}${this._options.charts_storage_api_version ? `&chartsStorageVer=${encodeURIComponent(this._options.charts_storage_api_version)}` : ''}${this._options.custom_css_url ? `&customCSS=${encodeURIComponent(this._options.custom_css_url)}` : ''}${this._options.custom_font_family ? `&customFontFamily=${encodeURIComponent(this._options.custom_font_family)}` : ''}${this._options.auto_save_delay ? `&autoSaveDelay=${encodeURIComponent(String(this._options.auto_save_delay))}` : ''}&debug=${encodeURIComponent(String(this._options.debug))}${this._options.debug_broker ? `&debugBroker=${encodeURIComponent(String(this._options.debug_broker))}` : ''}${this._options.snapshot_url ? `&snapshotUrl=${encodeURIComponent(this._options.snapshot_url)}` : ''}${this._options.timezone ? `&timezone=${encodeURIComponent(this._options.timezone)}` : ''}${this._options.study_count_limit ? `&studyCountLimit=${encodeURIComponent(String(this._options.study_count_limit))}` : ''}${this._options.symbol_search_request_delay ? `&ssreqdelay=${encodeURIComponent(String(this._options.symbol_search_request_delay))}` : ''}${this._options.compare_symbols ? `&compareSymbols=${encodeURIComponent(JSON.stringify(this._options.compare_symbols))}` : ''}${this._options.theme ? `&theme=${encodeURIComponent(String(this._options.theme))}` : ''}${this._options.header_widget_buttons_mode ? `&header_widget_buttons_mode=${encodeURIComponent(String(this._options.header_widget_buttons_mode))}` : ''}${this._options.time_scale ? `&time_scale=${encodeURIComponent(JSON.stringify(this._options.time_scale))}` : ''}`;
      return [
        `<iframe\n\t\tid="${this._id}" name="${this._id}" src="${n.href}" data-widget-options="${a}"\n\t\t${this._options.autosize || this._options.fullscreen ? '' : `width="${this._options.width}" height="${this._options.height}"`} title="Financial Chart" frameborder="0" allowTransparency="true" scrolling="no" allowfullscreen style="display:block;">\n\t</iframe>`,
        r,
      ];
    }

    activeChart() {
      return this._innerAPI().activeChart();
    }

    activeChartIndex() {
      return this._innerAPI().activeChartIndex();
    }

    addCustomCSSFile(e) {
      this._innerWindow().addCustomCSSFile(e);
    }

    applyOverrides(e) {
      (this._options = ve(this._options, { overrides: e })),
        this._doWhenInnerWindowLoaded((t) => {
          t.applyOverrides(e);
        });
    }

    applyStudiesOverrides(e) {
      this._doWhenInnerWindowLoaded((t) => {
        t.applyStudiesOverrides(e);
      });
    }

    changeTheme(e, t) {
      return this._innerWindow().changeTheme(e, t);
    }

    chart(e) {
      return this._innerAPI().chart(e);
    }

    chartsCount() {
      return this._innerAPI().chartsCount();
    }

    clearUndoHistory() {
      return this._innerAPI().clearUndoHistory();
    }

    closePopupsAndDialogs() {
      this._doWhenInnerApiLoaded((e) => {
        e.closePopupsAndDialogs();
      });
    }

    createButton(e) {
      return this._innerWindow().createButton(e);
    }

    createDropdown(e) {
      return this._innerWindow().createDropdown(e);
    }

    crosshairSync() {
      return this._innerAPI().crosshairSync();
    }

    currencyAndUnitVisibility() {
      return this._innerWindow().getCurrencyAndUnitVisibility();
    }

    customSymbolStatus() {
      return this._innerWindow().customSymbolStatus();
    }

    async customThemes() {
      return this._innerWindow().customThemes();
    }

    dateFormat() {
      return this._innerWindow().getDateFormat();
    }

    dateRangeSync() {
      return this._innerAPI().dateRangeSync();
    }

    drawOnAllCharts(e) {
      this._innerAPI().drawOnAllCharts(e);
    }

    drawOnAllChartsEnabled() {
      return this._innerAPI().drawOnAllChartsEnabled();
    }

    exitFullscreen() {
      this._innerAPI().exitFullscreen();
    }

    getAllFeatures() {
      return this._innerWindow().getAllFeatures();
    }

    getCSSCustomPropertyValue(e) {
      if (!1 === e.startsWith('--'))
        throw new Error('customPropertyName should begin with a double hyphen');
      const t = this._innerWindow().document.body;
      const i = t.style.getPropertyValue(e);
      if (i) return i;
      return getComputedStyle(t).getPropertyValue(e);
    }

    getIntervals() {
      return this._innerAPI().getIntervals();
    }

    getLanguage() {
      return this._options.locale;
    }

    getSavedCharts(e) {
      this._innerAPI().getSavedCharts(e);
    }

    getStudiesList() {
      return this._innerAPI().getStudiesList();
    }

    getStudyInputs(e) {
      return this._innerAPI().getStudyInputs(e);
    }

    getStudyStyles(e) {
      return this._innerAPI().getStudyStyles(e);
    }

    getTheme() {
      return this._innerWindow().getTheme();
    }

    headerReady() {
      return this._innerWindowLoaded.then(() => this._innerWindow().headerReady());
    }

    hideAllDrawingTools() {
      return this._innerAPI().hideAllDrawingTools();
    }

    intervalSync() {
      return this._innerAPI().intervalSync();
    }

    layout() {
      return this._innerAPI().layout();
    }

    layoutName() {
      return this._innerAPI().layoutName();
    }

    linking() {
      return this._innerAPI().linking;
    }

    load(e, t) {
      this._innerAPI().loadChart({ extendedData: t, json: e });
    }

    loadChartFromServer(e) {
      this._innerAPI().loadChartFromServer(e);
    }

    lockAllDrawingTools() {
      return this._innerAPI().lockAllDrawingTools();
    }

    magnetEnabled() {
      return this._innerAPI().magnetEnabled();
    }

    magnetMode() {
      return this._innerAPI().magnetMode();
    }

    mainSeriesPriceFormatter() {
      return this._innerAPI().mainSeriesPriceFormatter();
    }

    navigationButtonsVisibility() {
      return this._innerWindow().getNavigationButtonsVisibility();
    }

    news() {
      return this._innerAPI().news();
    }

    onChartReady(e) {
      this._ready ? e.call(this) : this._readyHandlers.push(e);
    }

    onContextMenu(e) {
      this._doWhenInnerApiLoaded((t) => {
        t.onContextMenu(e);
      });
    }

    onGrayedObjectClicked(e) {
      this._doWhenInnerApiLoaded((t) => {
        t.onGrayedObjectClicked(e);
      });
    }

    onShortcut(e, t) {
      this._doWhenInnerWindowLoaded((i) => {
        i.createShortcutAction(e, t);
      });
    }

    paneButtonsVisibility() {
      return this._innerWindow().getPaneButtonsVisibility();
    }

    redo() {
      return this._innerAPI().redo();
    }

    remove() {
      window.removeEventListener('resize', this._onWindowResize),
        this._readyHandlers.splice(0, this._readyHandlers.length),
        delete window[this._id],
        this._iFrame.parentNode && this._iFrame.parentNode.removeChild(this._iFrame);
    }

    removeChartFromServer(e, t) {
      this._innerAPI().removeChartFromServer(e, t);
    }

    resetLayoutSizes(e) {
      this._innerAPI().resetLayoutSizes(e);
    }

    save(e, t) {
      this._innerAPI().saveChart(e, t);
    }

    saveChartToServer(e, t, i) {
      this._innerAPI().saveChartToServer(e, t, i);
    }

    selectedLineTool() {
      return this._innerAPI().selectedLineTool();
    }

    selectLineTool(e, t) {
      this._innerAPI().selectLineTool(e, t);
    }

    setActiveChart(e) {
      return this._innerAPI().setActiveChart(e);
    }

    setCSSCustomProperty(e, t) {
      if (!1 === e.startsWith('--'))
        throw new Error('customPropertyName should begin with a double hyphen');
      this._innerWindow().document.body.style.setProperty(e, t);
    }

    setDateRangeLinkingEnabled(e) {
      this._innerAPI().setDateRangeLinkingEnabled(e);
    }

    setDebugMode(e) {
      this._innerAPI().setDebugMode(e);
    }

    setFeatureEnabled(e, t) {
      this._innerAPI().setFeatureEnabled(e, t);
    }

    setIntervalLinkingEnabled(e) {
      this._innerAPI().setIntervalLinkingEnabled(e);
    }

    setLayout(e) {
      this._innerAPI().setLayout(e);
    }

    setSymbol(e, t, i) {
      this._innerAPI().changeSymbol(e, t, i);
    }

    setTimeFrame(e) {
      this._innerAPI().setTimeFrame(e);
    }

    showConfirmDialog(e) {
      this._doWhenInnerApiLoaded((t) => {
        t.showConfirmDialog(e);
      });
    }

    showLoadChartDialog() {
      this._innerAPI().showLoadChartDialog();
    }

    showNoticeDialog(e) {
      this._doWhenInnerApiLoaded((t) => {
        t.showNoticeDialog(e);
      });
    }

    showSaveAsChartDialog() {
      this._innerAPI().showSaveAsChartDialog();
    }

    startFullscreen() {
      this._innerAPI().startFullscreen();
    }

    subscribe(e, t) {
      this._doWhenInnerApiLoaded((i) => {
        i.subscribe(e, t);
      });
    }

    supportedChartTypes() {
      return this._innerAPI().supportedChartTypes();
    }

    symbolInterval() {
      return this._innerAPI().getSymbolInterval();
    }

    symbolSync() {
      return this._innerAPI().symbolSync();
    }

    takeClientScreenshot(e) {
      return this._innerAPI().takeClientScreenshot(e);
    }

    takeScreenshot() {
      this._doWhenInnerApiLoaded((e) => {
        e.takeScreenshot();
      });
    }

    timeHoursFormat() {
      return this._innerWindow().getTimeHoursFormat();
    }

    timeSync() {
      return this._innerAPI().timeSync();
    }

    undo() {
      return this._innerAPI().undo();
    }

    undoRedoState() {
      return this._innerAPI().undoRedoState();
    }

    unloadUnusedCharts() {
      this._innerAPI().unloadUnusedCharts();
    }

    unsubscribe(e, t) {
      this._doWhenInnerApiLoaded((i) => {
        i.unsubscribe(e, t);
      });
    }

    watchList() {
      return this._innerAPI().watchlist();
    }

    watermark() {
      return this._innerAPI().watermark();
    }

    widgetbar() {
      return this._innerAPI().widgetbar();
    }
  };
  typeof window !== 'undefined' &&
    ((window.TradingView = window.TradingView || {}), (window.TradingView.version = De));
  const ke =
    !(typeof window === 'undefined' || !window.navigator || !window.navigator.userAgent) &&
    window.navigator.userAgent.includes('CriOS');
  (e.version = De), (e.widget = Ve), Object.defineProperty(e, '__esModule', { value: !0 });
});
