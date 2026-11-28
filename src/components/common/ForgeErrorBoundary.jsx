import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ForgeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected rendering error.' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#18181b] border border-red-500/40 rounded-xl p-6 space-y-4 text-center shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-serif font-bold text-amber-200">
              Skyforge Ledger Recovery
            </h2>
            <p className="text-xs text-zinc-400">
              An unexpected error occurred in the interface ({this.state.errorMessage}). Your saved
              ledger data is safe.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
            >
              Reload Forge Interface
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
